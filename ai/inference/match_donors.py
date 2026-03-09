"""
NIDAA — Donor Matching Inference
==================================
Loads a trained matching model and finds optimal donors for a blood request.

Usage:
  python match_donors.py --checkpoint_dir ../checkpoints/matcher

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
    from ai.models.donor_matcher import build_match_model
    HAS_MINDSPORE = True
except ImportError:
    HAS_MINDSPORE = False

from ai.models.donor_matcher import COMPATIBILITY, BLOOD_TYPE_IDX
from ai.scripts.preprocess import (
    one_hot, REGION_IDX, load_csv,
    _encode_donor, _encode_request_from_request,
)


def parse_args():
    parser = argparse.ArgumentParser(description='Donor matching inference')
    parser.add_argument('--checkpoint_dir', type=str,
                        default=os.path.join(os.path.dirname(__file__), '..', 'checkpoints', 'matcher'))
    parser.add_argument('--blood_type', type=str, default='O-',
                        help='Recipient blood type needed')
    parser.add_argument('--urgency', type=str, default='critical',
                        choices=['critical', 'high', 'medium', 'low'])
    parser.add_argument('--units', type=int, default=3)
    parser.add_argument('--region', type=str, default='Casablanca-Settat')
    parser.add_argument('--top_k', type=int, default=10)
    parser.add_argument('--device', type=str, default='CPU')
    return parser.parse_args()


def load_model(checkpoint_dir, device='CPU'):
    """Load trained donor matching model."""
    if not HAS_MINDSPORE:
        raise ImportError("MindSpore is required to load trained models. Install: pip install mindspore")
    context.set_context(mode=context.GRAPH_MODE, device_target=device)

    config_path = os.path.join(checkpoint_dir, 'config.json')
    with open(config_path, 'r') as f:
        config = json.load(f)

    net = build_match_model(
        config['model_type'],
        donor_features=config['donor_features'],
        request_features=config['request_features'],
        hidden_dim=config['hidden_dim'],
    )

    ckpt_path = os.path.join(checkpoint_dir, 'best_model.ckpt')
    param_dict = ms.load_checkpoint(ckpt_path)
    ms.load_param_into_net(net, param_dict)
    net.set_train(False)

    return net, config


def match_donors(net, donors, request_features, top_k=10):
    """Score all candidate donors and return top-K matches.

    Args:
        net: Trained MindSpore model
        donors: list of donor dicts from CSV
        request_features: numpy array (request_features,)
        top_k: number of top matches to return

    Returns:
        list of (donor_dict, score) sorted by score descending
    """
    donor_features_list = []
    valid_donors = []

    for donor in donors:
        feat = _encode_donor(donor)
        donor_features_list.append(feat)
        valid_donors.append(donor)

    donor_X = np.array(donor_features_list, dtype=np.float32)
    request_X = np.tile(request_features, (len(donor_X), 1))

    # Batch inference
    d_tensor = Tensor(donor_X, ms.float32)
    r_tensor = Tensor(request_X, ms.float32)

    scores = net(d_tensor, r_tensor).asnumpy().flatten()

    # Rank
    top_indices = np.argsort(scores)[::-1][:top_k]
    results = [(valid_donors[i], float(scores[i])) for i in top_indices]
    return results


def simulate_matching(blood_type, region, urgency, top_k=10):
    """Simulate donor matching without trained model."""
    compatible_types = COMPATIBILITY.get(blood_type, [blood_type])

    try:
        donors = load_csv('donor_profiles.csv')
    except FileNotFoundError:
        # Generate fake donors
        donors = []
        for i in range(100):
            bt = np.random.choice(list(BLOOD_TYPE_IDX.keys()))
            donors.append({
                'donor_id': f'DON-{i:05d}',
                'blood_type': bt,
                'age': str(np.random.randint(18, 65)),
                'gender': np.random.choice(['M', 'F']),
                'city': 'Casablanca',
                'region': region,
                'total_donations': str(np.random.randint(0, 30)),
                'is_active': '1',
                'latitude': str(round(np.random.uniform(33.0, 34.0), 4)),
                'longitude': str(round(np.random.uniform(-7.8, -7.2), 4)),
            })

    # Filter by blood type compatibility
    compatible = [d for d in donors if d['blood_type'] in compatible_types]

    # Filter by region (prefer same region)
    same_region = [d for d in compatible if d['region'] == region]
    pool = same_region if len(same_region) >= top_k else compatible

    # Score: prefer active, high-donation-count donors
    scored = []
    for d in pool[:200]:
        score = 0.5
        score += 0.2 * float(d.get('is_active', 0))
        score += 0.15 * min(float(d.get('total_donations', 0)), 20) / 20
        if d['region'] == region:
            score += 0.1
        urgency_boost = {'critical': 0.15, 'high': 0.1, 'medium': 0.05, 'low': 0.0}
        score += urgency_boost.get(urgency, 0)
        score += np.random.uniform(-0.05, 0.05)
        scored.append((d, min(score, 1.0)))

    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:top_k]


def encode_request(blood_type, urgency, units, region):
    """Encode a request into feature vector."""
    bt = one_hot(BLOOD_TYPE_IDX.get(blood_type, 0), 8)
    units_norm = min(units, 10) / 10.0
    urgency_map = {'critical': 1.0, 'high': 0.75, 'medium': 0.5, 'low': 0.25}
    urg = urgency_map.get(urgency, 0.5)
    region_enc = float(REGION_IDX.get(region, 0)) / 12.0
    return np.concatenate([bt, [units_norm, urg, 0.0, 0.0, region_enc, 0.0]]).astype(np.float32)


def format_results(matches, blood_type, urgency, region, units):
    """Pretty-print matching results."""
    lines = []
    lines.append("=" * 70)
    lines.append("NIDAA — Donor Matching Results")
    lines.append(f"  Requested: {units} units of {blood_type}")
    lines.append(f"  Urgency:   {urgency}")
    lines.append(f"  Region:    {region}")
    lines.append("=" * 70)
    lines.append(f"{'Rank':>4} | {'Donor ID':<12} | {'Blood Type':<10} | {'Donations':<10} | {'Score':>7}")
    lines.append("-" * 70)

    for rank, (donor, score) in enumerate(matches, 1):
        lines.append(
            f"  {rank:2d} | {donor['donor_id']:<12} | "
            f"{donor['blood_type']:<10} | "
            f"{donor.get('total_donations', '?'):<10} | "
            f"{score:>6.3f}"
        )

    lines.append("-" * 70)
    lines.append(f"Compatible blood types for {blood_type}: {', '.join(COMPATIBILITY.get(blood_type, []))}")
    lines.append("=" * 70)
    return "\n".join(lines)


def main():
    args = parse_args()
    print("NIDAA — Donor Matching Inference")
    print("=" * 70)

    config_path = os.path.join(args.checkpoint_dir, 'config.json')
    if os.path.exists(config_path):
        print("[INFO] Loading trained model...")
        net, config = load_model(args.checkpoint_dir, args.device)

        request_feat = encode_request(args.blood_type, args.urgency, args.units, args.region)
        donors = load_csv('donor_profiles.csv')
        # Pre-filter by compatibility
        compatible_types = COMPATIBILITY.get(args.blood_type, [args.blood_type])
        donors = [d for d in donors if d['blood_type'] in compatible_types]

        matches = match_donors(net, donors, request_feat, args.top_k)
    else:
        print("[INFO] No trained model found. Using simulation mode.")
        matches = simulate_matching(args.blood_type, args.region, args.urgency, args.top_k)

    report = format_results(matches, args.blood_type, args.urgency, args.region, args.units)
    print(report)

    # Save
    report_path = os.path.join(args.checkpoint_dir, 'matching_report.txt')
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"\n[✓] Report saved to {report_path}")


if __name__ == '__main__':
    main()
