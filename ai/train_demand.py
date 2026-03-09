"""
NIDAA — Blood Demand Forecasting Training Script
==================================================
Trains the LSTM/Transformer model on synthetic blood demand data.

Usage:
  python train_demand.py [--model lstm|transformer] [--epochs 100] [--lr 0.001]

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
from mindspore.train import Model
from mindspore.train.callback import LossMonitor, TimeMonitor, CheckpointConfig, ModelCheckpoint

# Add parent dir to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from models.demand_forecaster import build_demand_model
from scripts.preprocess import prepare_demand_data


def parse_args():
    parser = argparse.ArgumentParser(description='Train demand forecasting model')
    parser.add_argument('--model', type=str, default='lstm', choices=['lstm', 'transformer'])
    parser.add_argument('--epochs', type=int, default=100)
    parser.add_argument('--lr', type=float, default=0.001)
    parser.add_argument('--batch_size', type=int, default=32)
    parser.add_argument('--lookback', type=int, default=60)
    parser.add_argument('--forecast', type=int, default=14)
    parser.add_argument('--hidden_size', type=int, default=128)
    parser.add_argument('--region', type=str, default='Casablanca-Settat')
    parser.add_argument('--blood_type', type=str, default='O+')
    parser.add_argument('--device', type=str, default='CPU', choices=['CPU', 'GPU', 'Ascend'])
    parser.add_argument('--output_dir', type=str, default=None)
    return parser.parse_args()


class DemandLoss(nn.Cell):
    """Custom loss combining MSE with shortage penalty."""

    def __init__(self, shortage_weight=0.3):
        super(DemandLoss, self).__init__()
        self.mse = nn.MSELoss()
        self.shortage_weight = shortage_weight

    def construct(self, predictions, targets):
        mse_loss = self.mse(predictions, targets)
        # Penalize underestimation (would cause shortages) more than overestimation
        under_pred = ms.ops.relu(targets - predictions)
        shortage_penalty = ms.ops.mean(under_pred ** 2) * self.shortage_weight
        return mse_loss + shortage_penalty


class TrainingLogger:
    """Logs training metrics to file and console."""

    def __init__(self, log_path):
        self.log_path = log_path
        self.history = {'train_loss': [], 'val_loss': [], 'epoch_time': []}
        os.makedirs(os.path.dirname(log_path), exist_ok=True)

    def log(self, epoch, train_loss, val_loss, epoch_time):
        self.history['train_loss'].append(float(train_loss))
        self.history['val_loss'].append(float(val_loss))
        self.history['epoch_time'].append(float(epoch_time))

        msg = (
            f"Epoch [{epoch:4d}] | "
            f"Train Loss: {train_loss:.6f} | "
            f"Val Loss: {val_loss:.6f} | "
            f"Time: {epoch_time:.2f}s"
        )
        print(msg)

        with open(self.log_path, 'a', encoding='utf-8') as f:
            f.write(msg + '\n')

    def save_history(self, path):
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(self.history, f, indent=2)


def evaluate(model, X_val, y_val, loss_fn, batch_size):
    """Compute validation loss."""
    model.set_train(False)
    total_loss = 0.0
    n_batches = 0

    for i in range(0, len(X_val) - batch_size, batch_size):
        x_batch = Tensor(X_val[i:i + batch_size], ms.float32)
        y_batch = Tensor(y_val[i:i + batch_size], ms.float32)
        pred = model(x_batch)
        loss = loss_fn(pred, y_batch)
        total_loss += float(loss.asnumpy())
        n_batches += 1

    model.set_train(True)
    return total_loss / max(n_batches, 1)


def train():
    args = parse_args()

    # Setup
    context.set_context(mode=context.PYNATIVE_MODE, device_target=args.device)
    print("=" * 70)
    print("NIDAA — Blood Demand Forecasting Training")
    print("=" * 70)
    print(f"  Model:       {args.model}")
    print(f"  Device:      {args.device}")
    print(f"  Epochs:      {args.epochs}")
    print(f"  Batch size:  {args.batch_size}")
    print(f"  LR:          {args.lr}")
    print(f"  Lookback:    {args.lookback} days")
    print(f"  Forecast:    {args.forecast} days")
    print(f"  Region:      {args.region}")
    print(f"  Blood Type:  {args.blood_type}")
    print("=" * 70)

    # Output directory
    output_dir = args.output_dir or os.path.join(
        os.path.dirname(__file__), 'checkpoints', 'demand'
    )
    os.makedirs(output_dir, exist_ok=True)

    # Prepare data
    print("\n[1/4] Preparing data...")
    X_train, y_train, X_val, y_val, norm_params = prepare_demand_data(
        lookback=args.lookback,
        forecast_horizon=args.forecast,
        target_region=args.region,
        target_blood_type=args.blood_type,
    )
    input_size = X_train.shape[-1]

    # Save normalization params
    np.savez(
        os.path.join(output_dir, 'norm_params.npz'),
        feat_min=norm_params['feat_min'],
        feat_max=norm_params['feat_max'],
        target_min=np.array([norm_params['target_min']]),
        target_max=np.array([norm_params['target_max']]),
    )

    # Build model
    print("\n[2/4] Building model...")
    model_kwargs = {
        'input_size': input_size,
        'forecast_horizon': args.forecast,
    }
    if args.model == 'lstm':
        model_kwargs['hidden_size'] = args.hidden_size
        model_kwargs['num_layers'] = 2
    elif args.model == 'transformer':
        model_kwargs['d_model'] = args.hidden_size
        model_kwargs['nhead'] = 8
        model_kwargs['num_layers'] = 4

    net = build_demand_model(args.model, **model_kwargs)
    print(f"  Parameters: {sum(p.size for p in net.trainable_params()):,}")

    # Loss and optimizer
    loss_fn = DemandLoss(shortage_weight=0.3)
    optimizer = nn.Adam(net.trainable_params(), learning_rate=args.lr)

    # Training loop
    print("\n[3/4] Training...")
    logger = TrainingLogger(os.path.join(output_dir, 'training.log'))
    best_val_loss = float('inf')
    patience = 15
    patience_counter = 0

    net.set_train(True)

    # Define forward function (MindSpore can't compile inline lambdas)
    def forward_fn(x, y):
        pred = net(x)
        loss = loss_fn(pred, y)
        return loss

    grad_fn = ms.value_and_grad(forward_fn, None, optimizer.parameters)

    start_total = time.time()

    for epoch in range(1, args.epochs + 1):
        epoch_start = time.time()
        epoch_loss = 0.0
        n_batches = 0

        # Shuffle training data
        indices = np.random.permutation(len(X_train))
        X_shuffled = X_train[indices]
        y_shuffled = y_train[indices]

        for i in range(0, len(X_train) - args.batch_size, args.batch_size):
            x_batch = Tensor(X_shuffled[i:i + args.batch_size], ms.float32)
            y_batch = Tensor(y_shuffled[i:i + args.batch_size], ms.float32)

            loss, grads = grad_fn(x_batch, y_batch)
            optimizer(grads)

            epoch_loss += float(loss.asnumpy())
            n_batches += 1

        avg_train_loss = epoch_loss / max(n_batches, 1)
        val_loss = evaluate(net, X_val, y_val, loss_fn, args.batch_size)
        epoch_time = time.time() - epoch_start

        logger.log(epoch, avg_train_loss, val_loss, epoch_time)

        # Early stopping
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
            ms.save_checkpoint(net, os.path.join(output_dir, 'best_model.ckpt'))
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f"\n  Early stopping at epoch {epoch} (patience={patience})")
                break

    total_time = time.time() - start_total

    # Save final model
    print("\n[4/4] Saving artifacts...")
    ms.save_checkpoint(net, os.path.join(output_dir, 'final_model.ckpt'))
    logger.save_history(os.path.join(output_dir, 'training_history.json'))

    # Save config
    config = {
        'model_type': args.model,
        'input_size': input_size,
        'hidden_size': args.hidden_size,
        'forecast_horizon': args.forecast,
        'lookback': args.lookback,
        'region': args.region,
        'blood_type': args.blood_type,
        'best_val_loss': best_val_loss,
        'total_training_time_s': total_time,
        'epochs_completed': epoch,
        'device': args.device,
    }
    with open(os.path.join(output_dir, 'config.json'), 'w') as f:
        json.dump(config, f, indent=2)

    print("\n" + "=" * 70)
    print("Training Complete!")
    print(f"  Best Val Loss:    {best_val_loss:.6f}")
    print(f"  Total Time:       {total_time:.1f}s")
    print(f"  Checkpoints:      {output_dir}")
    print("=" * 70)


if __name__ == '__main__':
    train()
