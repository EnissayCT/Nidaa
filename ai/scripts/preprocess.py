"""
NIDAA — Data Preprocessing Pipeline
=====================================
Loads raw CSV datasets and prepares MindSpore-ready tensors for training.

Output shapes:
  Demand Forecasting:
    X_train: (N, lookback_window, num_features)
    y_train: (N, forecast_horizon)

  Donor Matching:
    donor_X:   (N, donor_features)
    request_X: (N, request_features)
    labels:    (N, 1)
"""

import os
import csv
import numpy as np
from datetime import datetime


DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')

BLOOD_TYPES = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-']
BLOOD_TYPE_IDX = {bt: i for i, bt in enumerate(BLOOD_TYPES)}

REGIONS = [
    'Rabat-Salé-Kénitra', 'Casablanca-Settat', 'Fès-Meknès',
    'Marrakech-Safi', 'Tanger-Tétouan-Al Hoceïma', 'Souss-Massa',
    'Oriental', 'Béni Mellal-Khénifra', 'Drâa-Tafilalet',
    'Laâyoune-Sakia El Hamra', 'Guelmim-Oued Noun', 'Dakhla-Oued Ed-Dahab',
]
REGION_IDX = {r: i for i, r in enumerate(REGIONS)}


def one_hot(idx, size):
    vec = np.zeros(size, dtype=np.float32)
    if 0 <= idx < size:
        vec[idx] = 1.0
    return vec


def load_csv(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)


# ── Demand Forecasting Preprocessing ─────────────────────────
def prepare_demand_data(
    lookback=60,
    forecast_horizon=14,
    target_region='Casablanca-Settat',
    target_blood_type='O+',
    train_ratio=0.8,
):
    """Prepare time-series data for demand forecasting.

    Filters data by region and blood type, creates sliding windows.

    Returns:
        X_train, y_train, X_val, y_val as numpy arrays
    """
    print(f"Loading blood_demand_daily.csv...")
    raw = load_csv('blood_demand_daily.csv')

    # Filter for target region and blood type
    filtered = [
        r for r in raw
        if r['region'] == target_region and r['blood_type'] == target_blood_type
    ]
    filtered.sort(key=lambda r: r['date'])
    print(f"  Filtered: {len(filtered)} records for {target_blood_type} in {target_region}")

    # Build feature matrix
    features_list = []
    targets_list = []

    for row in filtered:
        demand = float(row['demand_units'])
        supply = float(row['supply_units'])
        shortage = float(row['shortage_units'])
        is_ramadan = float(row['is_ramadan'])
        dow = one_hot(int(row['day_of_week']), 7)
        month = one_hot(int(row['month']) - 1, 12)
        bt = one_hot(BLOOD_TYPE_IDX.get(row['blood_type'], 0), 8)

        feat = np.concatenate([
            [demand, supply, shortage, is_ramadan],
            dow, month, bt
        ]).astype(np.float32)

        features_list.append(feat)
        targets_list.append(demand)

    features = np.array(features_list)
    targets = np.array(targets_list, dtype=np.float32)

    # Normalize features (min-max)
    feat_min = features.min(axis=0)
    feat_max = features.max(axis=0)
    feat_range = feat_max - feat_min
    feat_range[feat_range == 0] = 1.0  # avoid division by zero
    features_norm = (features - feat_min) / feat_range

    # Target normalization
    target_max = targets.max()
    target_min = targets.min()
    target_range = target_max - target_min if target_max != target_min else 1.0
    targets_norm = (targets - target_min) / target_range

    # Create sliding windows
    X, y = [], []
    total = len(features_norm)
    for i in range(lookback, total - forecast_horizon):
        X.append(features_norm[i - lookback:i])
        y.append(targets_norm[i:i + forecast_horizon])

    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.float32)
    print(f"  Windows: X={X.shape}, y={y.shape}")

    # Train/val split
    split = int(len(X) * train_ratio)
    X_train, y_train = X[:split], y[:split]
    X_val, y_val = X[split:], y[split:]

    print(f"  Train: {X_train.shape[0]} samples | Val: {X_val.shape[0]} samples")

    normalization_params = {
        'feat_min': feat_min, 'feat_max': feat_max,
        'target_min': target_min, 'target_max': target_max,
    }

    return X_train, y_train, X_val, y_val, normalization_params


# ── Donor Matching Preprocessing ──────────────────────────────
def prepare_matching_data(train_ratio=0.8):
    """Prepare paired donor-request data for matching model.

    Creates positive pairs (successful matches) and negative pairs
    (random mismatches or incompatible types) for binary classification.

    Returns:
        donor_train, request_train, labels_train,
        donor_val, request_val, labels_val as numpy arrays
    """
    print(f"Loading donor_profiles.csv and hospital_requests.csv...")
    donors = load_csv('donor_profiles.csv')
    requests = load_csv('hospital_requests.csv')
    donations = load_csv('donation_records.csv')

    # Index donors by ID
    donor_idx = {d['donor_id']: d for d in donors}

    # Build positive pairs from actual donations
    donor_features_list = []
    request_features_list = []
    labels = []

    # Positive samples: from successful donations
    for don in donations[:10000]:  # limit for training speed
        if int(don['successful']) != 1:
            continue
        donor = donor_idx.get(don['donor_id'])
        if not donor:
            continue

        d_feat = _encode_donor(donor)
        r_feat = _encode_request_from_donation(don)
        donor_features_list.append(d_feat)
        request_features_list.append(r_feat)
        labels.append(1.0)

    num_positive = len(labels)
    print(f"  Positive samples: {num_positive}")

    # Negative samples: random donor-request pairs (likely incompatible)
    import random
    random.seed(42)
    neg_count = 0
    for _ in range(num_positive):
        donor = random.choice(donors)
        req = random.choice(requests)

        d_feat = _encode_donor(donor)
        r_feat = _encode_request_from_request(req)
        donor_features_list.append(d_feat)
        request_features_list.append(r_feat)
        labels.append(0.0)
        neg_count += 1

    print(f"  Negative samples: {neg_count}")

    donor_X = np.array(donor_features_list, dtype=np.float32)
    request_X = np.array(request_features_list, dtype=np.float32)
    labels_arr = np.array(labels, dtype=np.float32).reshape(-1, 1)

    # Shuffle
    idx = np.random.RandomState(42).permutation(len(labels_arr))
    donor_X = donor_X[idx]
    request_X = request_X[idx]
    labels_arr = labels_arr[idx]

    # Split
    split = int(len(labels_arr) * train_ratio)
    print(f"  Total: {len(labels_arr)} | Train: {split} | Val: {len(labels_arr) - split}")

    return (
        donor_X[:split], request_X[:split], labels_arr[:split],
        donor_X[split:], request_X[split:], labels_arr[split:],
    )


def _encode_donor(donor):
    bt = one_hot(BLOOD_TYPE_IDX.get(donor['blood_type'], 0), 8)
    age = float(donor['age']) / 65.0
    gender = 1.0 if donor['gender'] == 'M' else 0.0
    total_don = min(float(donor['total_donations']), 50.0) / 50.0
    active = float(donor['is_active'])
    lat = (float(donor['latitude']) - 29.0) / 7.0 if donor['latitude'] else 0.5
    lon = (float(donor['longitude']) + 9.8) / 8.8 if donor['longitude'] else 0.5
    region = one_hot(REGION_IDX.get(donor['region'], 0), 12) if donor.get('region') else np.zeros(12, dtype=np.float32)

    # Take top-3 region dims to keep feature count manageable (or we can use region_weight)
    region_condensed = float(np.argmax(region)) / 12.0

    return np.concatenate([
        bt,
        [age, gender, total_don, active, lat, lon, region_condensed],
    ]).astype(np.float32)


def _encode_request_from_donation(don):
    bt = one_hot(BLOOD_TYPE_IDX.get(don['blood_type'], 0), 8)
    volume = float(don['volume_ml']) / 450.0
    hb = float(don['hemoglobin']) / 18.0
    dtype = 1.0 if don['donation_type'] == 'Platelets' else 0.0
    return np.concatenate([bt, [volume, hb, dtype, 1.0, 0.5, 0.0]]).astype(np.float32)


def _encode_request_from_request(req):
    bt = one_hot(BLOOD_TYPE_IDX.get(req['blood_type'], 0), 8)
    units = min(float(req['units_requested']), 10.0) / 10.0
    urgency_map = {'critical': 1.0, 'high': 0.75, 'medium': 0.5, 'low': 0.25}
    urgency = urgency_map.get(req['urgency'], 0.5)
    fulfilled = float(req['fulfilled'])
    donors_matched = min(float(req['donors_matched']), 12.0) / 12.0 if req['donors_matched'] else 0.0
    region_enc = float(REGION_IDX.get(req['region'], 0)) / 12.0

    return np.concatenate([bt, [units, urgency, fulfilled, donors_matched, region_enc, 0.0]]).astype(np.float32)


if __name__ == '__main__':
    print("=" * 60)
    print("Testing Demand Forecasting Preprocessing")
    print("=" * 60)
    X_train, y_train, X_val, y_val, params = prepare_demand_data()
    print(f"Feature dim: {X_train.shape[-1]}")
    print()

    print("=" * 60)
    print("Testing Donor Matching Preprocessing")
    print("=" * 60)
    d_train, r_train, l_train, d_val, r_val, l_val = prepare_matching_data()
    print(f"Donor feature dim: {d_train.shape[-1]}")
    print(f"Request feature dim: {r_train.shape[-1]}")
