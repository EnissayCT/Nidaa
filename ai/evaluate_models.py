"""
NIDAA — Full Model Evaluation (Colab)
=======================================
Run this on Google Colab where MindSpore is installed.
Loads trained models, runs inference on held-out test data,
and computes precise metrics (MAE, RMSE, MAPE, Precision, Recall, F1, AUC).

Usage on Colab:
  !pip install mindspore scikit-learn matplotlib
  %cd /content/Nidaa
  !python ai/evaluate_models.py
"""

import os
import sys
import json
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import mindspore as ms
from mindspore import Tensor, context

from ai.models.demand_forecaster import build_demand_model
from ai.models.donor_matcher import build_match_model
from ai.scripts.preprocess import (
    prepare_demand_data, prepare_matching_data,
    BLOOD_TYPES, REGIONS,
)

context.set_context(mode=context.PYNATIVE_MODE, device_target='CPU')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CKPT_DIR = os.path.join(BASE_DIR, 'checkpoints')
EVAL_DIR = os.path.join(BASE_DIR, 'evaluation')
os.makedirs(EVAL_DIR, exist_ok=True)


# ── Demand Forecaster Evaluation ──────────────────────────────

def evaluate_demand():
    print("=" * 60)
    print("1. EVALUATING DEMAND FORECASTING MODEL")
    print("=" * 60)

    ckpt_dir = os.path.join(CKPT_DIR, 'demand')
    with open(os.path.join(ckpt_dir, 'config.json')) as f:
        config = json.load(f)

    # Rebuild data with same params
    X_train, y_train, X_val, y_val, norm_params = prepare_demand_data(
        lookback=config['lookback'],
        forecast_horizon=config['forecast_horizon'],
        target_region=config['region'],
        target_blood_type=config['blood_type'],
    )

    # Load model
    model_kwargs = {'input_size': config['input_size'], 'forecast_horizon': config['forecast_horizon']}
    if config['model_type'] == 'lstm':
        model_kwargs['hidden_size'] = config['hidden_size']
    net = build_demand_model(config['model_type'], **model_kwargs)
    param_dict = ms.load_checkpoint(os.path.join(ckpt_dir, 'best_model.ckpt'))
    ms.load_param_into_net(net, param_dict)
    net.set_train(False)

    # Run inference on validation set
    print(f"\nRunning inference on {len(X_val)} validation samples...")
    batch_size = 32
    all_preds = []
    all_targets = []

    for i in range(0, len(X_val), batch_size):
        x_batch = Tensor(X_val[i:i + batch_size], ms.float32)
        pred = net(x_batch).asnumpy()
        all_preds.append(pred)
        all_targets.append(y_val[i:i + batch_size])

    preds = np.concatenate(all_preds, axis=0)
    targets = np.concatenate(all_targets, axis=0)

    # Denormalize
    t_min = norm_params['target_min']
    t_max = norm_params['target_max']
    t_range = t_max - t_min if t_max != t_min else 1.0

    preds_real = preds * t_range + t_min
    targets_real = targets * t_range + t_min
    preds_real = np.maximum(preds_real, 0)

    # Compute metrics
    errors = preds_real - targets_real
    abs_errors = np.abs(errors)

    mae = float(np.mean(abs_errors))
    rmse = float(np.sqrt(np.mean(errors ** 2)))
    # MAPE: avoid division by zero
    nonzero_mask = targets_real > 0.5
    if nonzero_mask.sum() > 0:
        mape = float(np.mean(abs_errors[nonzero_mask] / targets_real[nonzero_mask]) * 100)
    else:
        mape = 0.0

    # R² score
    ss_res = np.sum(errors ** 2)
    ss_tot = np.sum((targets_real - np.mean(targets_real)) ** 2)
    r2 = float(1 - ss_res / ss_tot) if ss_tot > 0 else 0.0

    # Per-day metrics
    per_day_mae = [float(np.mean(np.abs(preds_real[:, d] - targets_real[:, d])))
                   for d in range(config['forecast_horizon'])]

    metrics = {
        'mae': round(mae, 4),
        'rmse': round(rmse, 4),
        'mape_pct': round(mape, 2),
        'r2_score': round(r2, 4),
        'per_day_mae': [round(v, 4) for v in per_day_mae],
        'val_samples': len(X_val),
        'forecast_horizon': config['forecast_horizon'],
    }

    print(f"\n  MAE:   {mae:.4f} units/day")
    print(f"  RMSE:  {rmse:.4f} units/day")
    print(f"  MAPE:  {mape:.2f}%")
    print(f"  R²:    {r2:.4f}")
    print(f"\n  Per-day MAE:")
    for d, m in enumerate(per_day_mae):
        print(f"    Day +{d+1:2d}: {m:.4f}")

    return metrics, preds_real, targets_real


# ── Donor Matcher Evaluation ──────────────────────────────────

def evaluate_matcher():
    print("\n" + "=" * 60)
    print("2. EVALUATING DONOR MATCHING MODEL")
    print("=" * 60)

    ckpt_dir = os.path.join(CKPT_DIR, 'matcher')
    with open(os.path.join(ckpt_dir, 'config.json')) as f:
        config = json.load(f)

    # Rebuild data
    d_train, r_train, l_train, d_val, r_val, l_val = prepare_matching_data()

    # Load model
    net = build_match_model(
        config['model_type'],
        donor_features=config['donor_features'],
        request_features=config['request_features'],
        hidden_dim=config['hidden_dim'],
    )
    param_dict = ms.load_checkpoint(os.path.join(ckpt_dir, 'best_model.ckpt'))
    ms.load_param_into_net(net, param_dict)
    net.set_train(False)

    # Run inference on validation set
    print(f"\nRunning inference on {len(l_val)} validation samples...")
    batch_size = 64
    all_preds = []

    for i in range(0, len(l_val), batch_size):
        d_batch = Tensor(d_val[i:i + batch_size], ms.float32)
        r_batch = Tensor(r_val[i:i + batch_size], ms.float32)
        pred = net(d_batch, r_batch).asnumpy()
        all_preds.append(pred)

    preds = np.concatenate(all_preds, axis=0).flatten()
    labels = l_val[:len(preds)].flatten()

    # Binary classification metrics
    pred_binary = (preds > 0.5).astype(np.float32)

    tp = float(np.sum((pred_binary == 1) & (labels == 1)))
    tn = float(np.sum((pred_binary == 0) & (labels == 0)))
    fp = float(np.sum((pred_binary == 1) & (labels == 0)))
    fn = float(np.sum((pred_binary == 0) & (labels == 1)))

    accuracy = (tp + tn) / (tp + tn + fp + fn)
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0.0
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0.0

    # AUC-ROC (manual trapezoidal)
    thresholds = np.linspace(0, 1, 200)
    tpr_list, fpr_list = [], []
    for th in thresholds:
        p = (preds > th).astype(float)
        tp_t = np.sum((p == 1) & (labels == 1))
        fn_t = np.sum((p == 0) & (labels == 1))
        fp_t = np.sum((p == 1) & (labels == 0))
        tn_t = np.sum((p == 0) & (labels == 0))
        tpr_list.append(tp_t / (tp_t + fn_t) if (tp_t + fn_t) > 0 else 0)
        fpr_list.append(fp_t / (fp_t + tn_t) if (fp_t + tn_t) > 0 else 0)

    # Sort by FPR for AUC calculation
    sorted_pairs = sorted(zip(fpr_list, tpr_list))
    fpr_sorted = [p[0] for p in sorted_pairs]
    tpr_sorted = [p[1] for p in sorted_pairs]
    auc = float(np.trapz(tpr_sorted, fpr_sorted))

    metrics = {
        'accuracy': round(accuracy, 6),
        'precision': round(precision, 6),
        'recall': round(recall, 6),
        'f1_score': round(f1, 6),
        'specificity': round(specificity, 6),
        'auc_roc': round(auc, 6),
        'confusion_matrix': {
            'true_positive': int(tp),
            'true_negative': int(tn),
            'false_positive': int(fp),
            'false_negative': int(fn),
        },
        'val_samples': len(labels),
    }

    print(f"\n  Accuracy:    {accuracy*100:.2f}%")
    print(f"  Precision:   {precision*100:.2f}%")
    print(f"  Recall:      {recall*100:.2f}%")
    print(f"  F1 Score:    {f1*100:.2f}%")
    print(f"  Specificity: {specificity*100:.2f}%")
    print(f"  AUC-ROC:     {auc:.4f}")
    print(f"\n  Confusion Matrix:")
    print(f"    TP: {int(tp):5d}  |  FP: {int(fp):5d}")
    print(f"    FN: {int(fn):5d}  |  TN: {int(tn):5d}")

    return metrics, preds, labels, fpr_sorted, tpr_sorted


# ── Chart Generation ──────────────────────────────────────────

def generate_eval_charts(demand_preds, demand_targets, forecast_horizon,
                         matcher_preds, matcher_labels, fpr, tpr):
    try:
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
    except ImportError:
        print("[WARN] matplotlib not installed, skipping charts.")
        return

    plt.rcParams.update({
        'figure.facecolor': '#0f172a',
        'axes.facecolor': '#1e293b',
        'axes.edgecolor': '#334155',
        'axes.labelcolor': '#e2e8f0',
        'text.color': '#e2e8f0',
        'xtick.color': '#94a3b8',
        'ytick.color': '#94a3b8',
        'grid.color': '#334155',
        'grid.alpha': 0.5,
        'font.size': 11,
    })

    RED = '#ef4444'
    BLUE = '#3b82f6'
    GREEN = '#22c55e'

    # 1. Predicted vs Actual (first 5 samples)
    fig, axes = plt.subplots(2, 3, figsize=(15, 8))
    for idx in range(min(5, len(demand_preds))):
        ax = axes[idx // 3][idx % 3]
        days = range(1, forecast_horizon + 1)
        ax.plot(days, demand_targets[idx], color=BLUE, marker='o', markersize=4, label='Actual')
        ax.plot(days, demand_preds[idx], color=RED, marker='s', markersize=4, label='Predicted')
        ax.set_title(f'Sample {idx+1}', fontweight='bold')
        ax.set_xlabel('Day')
        ax.set_ylabel('Units')
        ax.legend(fontsize=8, facecolor='#1e293b', edgecolor='#334155')
        ax.grid(True)

    # Hide last subplot if only 5 samples
    axes[1][2].axis('off')
    fig.suptitle('NIDAA — Demand Forecast: Predicted vs Actual', fontsize=14, fontweight='bold')
    fig.tight_layout()
    fig.savefig(os.path.join(EVAL_DIR, 'demand_predicted_vs_actual.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("[OK] demand_predicted_vs_actual.png")

    # 2. Error distribution
    errors = (demand_preds - demand_targets).flatten()
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.hist(errors, bins=50, color=BLUE, alpha=0.7, edgecolor='#1e293b')
    ax.axvline(x=0, color=RED, linestyle='--', linewidth=2)
    ax.set_xlabel('Prediction Error (units)')
    ax.set_ylabel('Frequency')
    ax.set_title('NIDAA — Demand Forecast Error Distribution', fontsize=14, fontweight='bold')
    ax.grid(True)
    fig.tight_layout()
    fig.savefig(os.path.join(EVAL_DIR, 'demand_error_distribution.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("[OK] demand_error_distribution.png")

    # 3. ROC Curve
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.plot(fpr, tpr, color=BLUE, linewidth=2, label='ROC Curve')
    ax.plot([0, 1], [0, 1], color='#475569', linestyle='--', linewidth=1, label='Random')
    ax.fill_between(fpr, tpr, alpha=0.1, color=BLUE)
    ax.set_xlabel('False Positive Rate')
    ax.set_ylabel('True Positive Rate')
    ax.set_title('NIDAA — Donor Matching: ROC Curve', fontsize=14, fontweight='bold')
    ax.legend(facecolor='#1e293b', edgecolor='#334155')
    ax.grid(True)
    fig.tight_layout()
    fig.savefig(os.path.join(EVAL_DIR, 'matcher_roc_curve.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("[OK] matcher_roc_curve.png")

    # 4. Score distribution
    fig, ax = plt.subplots(figsize=(10, 6))
    pos_scores = matcher_preds[matcher_labels == 1]
    neg_scores = matcher_preds[matcher_labels == 0]
    ax.hist(pos_scores, bins=50, color=GREEN, alpha=0.6, label='Positive (match)', edgecolor='#1e293b')
    ax.hist(neg_scores, bins=50, color=RED, alpha=0.6, label='Negative (no match)', edgecolor='#1e293b')
    ax.axvline(x=0.5, color='white', linestyle='--', linewidth=2, label='Threshold (0.5)')
    ax.set_xlabel('Model Score')
    ax.set_ylabel('Frequency')
    ax.set_title('NIDAA — Donor Matching: Score Distribution', fontsize=14, fontweight='bold')
    ax.legend(facecolor='#1e293b', edgecolor='#334155')
    ax.grid(True)
    fig.tight_layout()
    fig.savefig(os.path.join(EVAL_DIR, 'matcher_score_distribution.png'), dpi=150, bbox_inches='tight')
    plt.close(fig)
    print("[OK] matcher_score_distribution.png")


# ── Main ──────────────────────────────────────────────────────

def main():
    print("NIDAA — Full Model Evaluation (with MindSpore)")
    print("=" * 60)

    demand_metrics, demand_preds, demand_targets = evaluate_demand()
    matcher_metrics, matcher_preds, matcher_labels, fpr, tpr = evaluate_matcher()

    # Save combined metrics
    all_metrics = {
        'demand_forecaster': demand_metrics,
        'donor_matcher': matcher_metrics,
    }
    with open(os.path.join(EVAL_DIR, 'full_metrics.json'), 'w') as f:
        json.dump(all_metrics, f, indent=2)
    print(f"\n[OK] Saved full_metrics.json")

    # Generate charts
    print("\nGenerating evaluation charts...")
    generate_eval_charts(
        demand_preds, demand_targets, demand_metrics['forecast_horizon'],
        matcher_preds, matcher_labels, fpr, tpr,
    )

    print("\n" + "=" * 60)
    print("FULL EVALUATION COMPLETE")
    print("=" * 60)


if __name__ == '__main__':
    main()
