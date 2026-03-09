"""
NIDAA — Demand Forecasting Inference
======================================
Loads a trained LSTM/Transformer model and produces blood demand predictions.

Usage:
  python predict_demand.py --checkpoint ../checkpoints/demand/best_model.ckpt

Designed for MindSpore 2.3+ / Huawei ModelArts
"""

import os
import sys
import json
import argparse
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

# Lazy MindSpore imports (allows simulation mode without MindSpore installed)
try:
    import mindspore as ms
    from mindspore import Tensor, context
    from ai.models.demand_forecaster import build_demand_model
    HAS_MINDSPORE = True
except ImportError:
    HAS_MINDSPORE = False

from ai.scripts.preprocess import BLOOD_TYPES, REGIONS, BLOOD_TYPE_IDX, one_hot


def parse_args():
    parser = argparse.ArgumentParser(description='Demand forecasting inference')
    parser.add_argument('--checkpoint_dir', type=str,
                        default=os.path.join(os.path.dirname(__file__), '..', 'checkpoints', 'demand'))
    parser.add_argument('--region', type=str, default='Casablanca-Settat')
    parser.add_argument('--blood_type', type=str, default='O+')
    parser.add_argument('--device', type=str, default='CPU')
    return parser.parse_args()


def load_model(checkpoint_dir, device='CPU'):
    """Load a trained demand model from checkpoint directory."""
    if not HAS_MINDSPORE:
        raise ImportError("MindSpore is required to load trained models. Install: pip install mindspore")
    context.set_context(mode=context.GRAPH_MODE, device_target=device)

    config_path = os.path.join(checkpoint_dir, 'config.json')
    with open(config_path, 'r') as f:
        config = json.load(f)

    model_kwargs = {
        'input_size': config['input_size'],
        'forecast_horizon': config['forecast_horizon'],
    }
    if config['model_type'] == 'lstm':
        model_kwargs['hidden_size'] = config['hidden_size']
    elif config['model_type'] == 'transformer':
        model_kwargs['d_model'] = config['hidden_size']

    net = build_demand_model(config['model_type'], **model_kwargs)

    ckpt_path = os.path.join(checkpoint_dir, 'best_model.ckpt')
    param_dict = ms.load_checkpoint(ckpt_path)
    ms.load_param_into_net(net, param_dict)
    net.set_train(False)

    # Load normalization params
    norm = np.load(os.path.join(checkpoint_dir, 'norm_params.npz'))

    return net, config, norm


def predict(net, input_sequence, norm_params):
    """Run inference on a prepared input sequence.

    Args:
        net: Loaded MindSpore model
        input_sequence: numpy array (1, lookback, features)
        norm_params: dict with target_min and target_max

    Returns:
        predictions: numpy array of denormalized demand values
    """
    x = Tensor(input_sequence, ms.float32)
    pred_norm = net(x).asnumpy()[0]

    # Denormalize
    target_min = float(norm_params['target_min'][0])
    target_max = float(norm_params['target_max'][0])
    predictions = pred_norm * (target_max - target_min) + target_min
    predictions = np.maximum(predictions, 0).astype(int)

    return predictions


def predict_all_types(checkpoint_dir, region, device='CPU'):
    """Generate predictions for all blood types in a region.

    Returns:
        dict: {blood_type: [day1, day2, ...]}
    """
    results = {}
    for bt in BLOOD_TYPES:
        bt_dir = os.path.join(checkpoint_dir, f'{bt.replace("+", "pos").replace("-", "neg")}')
        if os.path.exists(os.path.join(bt_dir, 'config.json')):
            net, config, norm = load_model(bt_dir, device)
            # Fake last-60-days input for demo (in production, pull live data)
            lookback = config['lookback']
            input_size = config['input_size']
            demo_input = np.random.rand(1, lookback, input_size).astype(np.float32)
            results[bt] = predict(net, demo_input, norm).tolist()
        else:
            # Fallback: generate simulated predictions
            results[bt] = simulate_predictions(bt, region)

    return results


def simulate_predictions(blood_type, region, horizon=14):
    """Generate realistic-looking predictions without a trained model.
    Used as fallback when model checkpoints aren't available."""
    base_demand = {
        'O+': 15, 'A+': 11, 'B+': 7, 'AB+': 3,
        'O-': 2, 'A-': 2, 'B-': 1, 'AB-': 1,
    }
    base = base_demand.get(blood_type, 5)
    np.random.seed(hash(blood_type + region) % 2**31)
    daily = []
    for d in range(horizon):
        weekday_factor = 0.8 if d % 7 >= 5 else 1.0
        noise = np.random.normal(0, base * 0.15)
        daily.append(max(0, int(base * weekday_factor + noise)))
    return daily


def format_report(predictions, region, blood_type):
    """Pretty-print a forecast report."""
    report = []
    report.append("=" * 60)
    report.append(f"NIDAA — Blood Demand Forecast Report")
    report.append(f"Region:     {region}")
    report.append(f"Blood Type: {blood_type}")
    report.append("=" * 60)
    report.append(f"{'Day':>4} | {'Predicted Demand (units)':>25}")
    report.append("-" * 35)
    for i, val in enumerate(predictions):
        report.append(f"  +{i+1:2d} | {val:>25}")
    report.append("-" * 35)
    report.append(f"Total 14-day demand: {sum(predictions)} units")
    report.append(f"Average daily:       {sum(predictions)/len(predictions):.1f} units")
    report.append("=" * 60)
    return "\n".join(report)


def main():
    args = parse_args()
    print("NIDAA — Demand Forecasting Inference")
    print("=" * 60)

    # Try loading trained model
    config_path = os.path.join(args.checkpoint_dir, 'config.json')
    if os.path.exists(config_path):
        print("[INFO] Loading trained model...")
        net, config, norm = load_model(args.checkpoint_dir, args.device)
        lookback = config['lookback']
        input_size = config['input_size']

        # In production, you'd fetch the latest {lookback} days of real data here
        # For demo, using random normalized input
        demo_input = np.random.rand(1, lookback, input_size).astype(np.float32)
        predictions = predict(net, demo_input, norm)
    else:
        print("[INFO] No trained model found. Using simulation mode.")
        predictions = simulate_predictions(args.blood_type, args.region)

    report = format_report(predictions, args.region, args.blood_type)
    print(report)

    # Save report
    report_path = os.path.join(args.checkpoint_dir, 'inference_report.txt')
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"\n[✓] Report saved to {report_path}")


if __name__ == '__main__':
    main()
