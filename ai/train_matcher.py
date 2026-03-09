"""
NIDAA — Donor Matching Training Script
========================================
Trains the donor-recipient matching neural network.

Usage:
  python train_matcher.py [--model basic|attention] [--epochs 50] [--lr 0.001]

Designed for MindSpore 2.3+ / Huawei ModelArts CANN
"""

import os
import sys
import json
import time
import argparse
import numpy as np

import mindspore as ms
import mindspore.nn as nn
from mindspore import Tensor, context

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from models.donor_matcher import build_match_model
from scripts.preprocess import prepare_matching_data


def parse_args():
    parser = argparse.ArgumentParser(description='Train donor matching model')
    parser.add_argument('--model', type=str, default='basic', choices=['basic', 'attention'])
    parser.add_argument('--epochs', type=int, default=50)
    parser.add_argument('--lr', type=float, default=0.001)
    parser.add_argument('--batch_size', type=int, default=64)
    parser.add_argument('--hidden_dim', type=int, default=128)
    parser.add_argument('--device', type=str, default='CPU', choices=['CPU', 'GPU', 'Ascend'])
    parser.add_argument('--output_dir', type=str, default=None)
    return parser.parse_args()


class MatchingLogger:
    """Logs training metrics."""

    def __init__(self, log_path):
        self.log_path = log_path
        self.history = {
            'train_loss': [], 'val_loss': [],
            'train_acc': [], 'val_acc': [],
            'epoch_time': [],
        }
        os.makedirs(os.path.dirname(log_path), exist_ok=True)

    def log(self, epoch, train_loss, val_loss, train_acc, val_acc, epoch_time):
        self.history['train_loss'].append(float(train_loss))
        self.history['val_loss'].append(float(val_loss))
        self.history['train_acc'].append(float(train_acc))
        self.history['val_acc'].append(float(val_acc))
        self.history['epoch_time'].append(float(epoch_time))

        msg = (
            f"Epoch [{epoch:4d}] | "
            f"Train Loss: {train_loss:.6f} | "
            f"Val Loss: {val_loss:.6f} | "
            f"Train Acc: {train_acc:.4f} | "
            f"Val Acc: {val_acc:.4f} | "
            f"Time: {epoch_time:.2f}s"
        )
        print(msg)

        with open(self.log_path, 'a', encoding='utf-8') as f:
            f.write(msg + '\n')

    def save_history(self, path):
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(self.history, f, indent=2)


def compute_accuracy(predictions, labels, threshold=0.5):
    pred_binary = (predictions > threshold).astype(np.float32)
    correct = (pred_binary == labels).sum()
    return correct / len(labels)


def evaluate(net, donor_X, request_X, labels, loss_fn, batch_size):
    net.set_train(False)
    total_loss = 0.0
    all_preds = []
    n_batches = 0

    for i in range(0, len(labels) - batch_size, batch_size):
        d_batch = Tensor(donor_X[i:i + batch_size], ms.float32)
        r_batch = Tensor(request_X[i:i + batch_size], ms.float32)
        l_batch = Tensor(labels[i:i + batch_size], ms.float32)

        pred = net(d_batch, r_batch)
        loss = loss_fn(pred, l_batch)
        total_loss += float(loss.asnumpy())
        all_preds.append(pred.asnumpy())
        n_batches += 1

    net.set_train(True)
    avg_loss = total_loss / max(n_batches, 1)
    all_preds = np.concatenate(all_preds, axis=0)
    accuracy = compute_accuracy(all_preds, labels[:len(all_preds)])
    return avg_loss, accuracy


def train():
    args = parse_args()

    context.set_context(mode=context.GRAPH_MODE, device_target=args.device)
    print("=" * 70)
    print("NIDAA — Donor Matching Training")
    print("=" * 70)
    print(f"  Model:       {args.model}")
    print(f"  Device:      {args.device}")
    print(f"  Epochs:      {args.epochs}")
    print(f"  Batch size:  {args.batch_size}")
    print(f"  LR:          {args.lr}")
    print(f"  Hidden dim:  {args.hidden_dim}")
    print("=" * 70)

    output_dir = args.output_dir or os.path.join(
        os.path.dirname(__file__), '..', 'checkpoints', 'matcher'
    )
    os.makedirs(output_dir, exist_ok=True)

    # Prepare data
    print("\n[1/4] Preparing data...")
    d_train, r_train, l_train, d_val, r_val, l_val = prepare_matching_data()

    donor_features = d_train.shape[-1]
    request_features = r_train.shape[-1]
    print(f"  Donor features: {donor_features}")
    print(f"  Request features: {request_features}")

    # Build model
    print("\n[2/4] Building model...")
    net = build_match_model(
        args.model,
        donor_features=donor_features,
        request_features=request_features,
        hidden_dim=args.hidden_dim,
    )
    print(f"  Parameters: {sum(p.size for p in net.trainable_params()):,}")

    # Loss and optimizer
    loss_fn = nn.BCELoss()
    optimizer = nn.Adam(net.trainable_params(), learning_rate=args.lr)

    # Training loop
    print("\n[3/4] Training...")
    logger = MatchingLogger(os.path.join(output_dir, 'training.log'))
    best_val_acc = 0.0
    patience = 10
    patience_counter = 0

    net.set_train(True)
    grad_fn = ms.value_and_grad(
        lambda d, r, l: loss_fn(net(d, r), l),
        None,
        optimizer.parameters,
    )

    start_total = time.time()

    for epoch in range(1, args.epochs + 1):
        epoch_start = time.time()
        epoch_loss = 0.0
        epoch_preds = []
        n_batches = 0

        # Shuffle
        indices = np.random.permutation(len(l_train))
        d_shuffled = d_train[indices]
        r_shuffled = r_train[indices]
        l_shuffled = l_train[indices]

        for i in range(0, len(l_train) - args.batch_size, args.batch_size):
            d_batch = Tensor(d_shuffled[i:i + args.batch_size], ms.float32)
            r_batch = Tensor(r_shuffled[i:i + args.batch_size], ms.float32)
            l_batch = Tensor(l_shuffled[i:i + args.batch_size], ms.float32)

            loss, grads = grad_fn(d_batch, r_batch, l_batch)
            optimizer(grads)

            epoch_loss += float(loss.asnumpy())
            pred = net(d_batch, r_batch)
            epoch_preds.append(pred.asnumpy())
            n_batches += 1

        avg_train_loss = epoch_loss / max(n_batches, 1)
        train_preds = np.concatenate(epoch_preds, axis=0)
        train_acc = compute_accuracy(train_preds, l_shuffled[:len(train_preds)])

        val_loss, val_acc = evaluate(net, d_val, r_val, l_val, loss_fn, args.batch_size)
        epoch_time = time.time() - epoch_start

        logger.log(epoch, avg_train_loss, val_loss, train_acc, val_acc, epoch_time)

        # Save best
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            patience_counter = 0
            ms.save_checkpoint(net, os.path.join(output_dir, 'best_model.ckpt'))
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f"\n  Early stopping at epoch {epoch}")
                break

    total_time = time.time() - start_total

    # Save
    print("\n[4/4] Saving artifacts...")
    ms.save_checkpoint(net, os.path.join(output_dir, 'final_model.ckpt'))
    logger.save_history(os.path.join(output_dir, 'training_history.json'))

    config = {
        'model_type': args.model,
        'donor_features': donor_features,
        'request_features': request_features,
        'hidden_dim': args.hidden_dim,
        'best_val_accuracy': best_val_acc,
        'total_training_time_s': total_time,
        'epochs_completed': epoch,
        'device': args.device,
    }
    with open(os.path.join(output_dir, 'config.json'), 'w') as f:
        json.dump(config, f, indent=2)

    print("\n" + "=" * 70)
    print("Training Complete!")
    print(f"  Best Val Accuracy: {best_val_acc:.4f}")
    print(f"  Total Time:        {total_time:.1f}s")
    print(f"  Checkpoints:       {output_dir}")
    print("=" * 70)


if __name__ == '__main__':
    train()
