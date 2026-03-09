"""
NIDAA — Donor Matching & Compatibility Model (MindSpore)
=========================================================
Neural network for intelligent donor-recipient matching that goes
beyond simple blood-type compatibility.

The model considers:
  - Blood type compatibility matrix (hard constraint)
  - Geographic proximity (minimize cold-chain logistics)
  - Donor availability & history (recency, frequency)
  - Urgency weighting (critical requests prioritized)
  - Predicted donation success probability

Architecture:
  [Donor Features] ──┐
                      ├──→ Concat → Dense(128) → Dense(64) → Dense(32) → Sigmoid(1)
  [Request Features] ─┘

Output: match_score ∈ [0, 1] representing suitability of a donor for a request.

Designed for MindSpore 2.3+ / Huawei ModelArts
"""

# Blood type compatibility matrix (recipient → compatible donors)
COMPATIBILITY = {
    'O-':  ['O-'],
    'O+':  ['O-', 'O+'],
    'A-':  ['O-', 'A-'],
    'A+':  ['O-', 'O+', 'A-', 'A+'],
    'B-':  ['O-', 'B-'],
    'B+':  ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
}

BLOOD_TYPE_IDX = {'O+': 0, 'A+': 1, 'B+': 2, 'AB+': 3, 'O-': 4, 'A-': 5, 'B-': 6, 'AB-': 7}


def encode_blood_type(bt_str):
    """One-hot encode a blood type string."""
    idx = BLOOD_TYPE_IDX.get(bt_str, 0)
    encoding = [0.0] * 8
    encoding[idx] = 1.0
    return encoding


def check_compatibility(donor_bt, recipient_bt):
    """Check if donor blood type is compatible with recipient."""
    compatible = COMPATIBILITY.get(recipient_bt, [])
    return donor_bt in compatible


# ── MindSpore Model Definitions ──────────────────────────────
# Guarded behind try/except so constants above remain importable
# even without MindSpore installed.

try:
    import mindspore as ms
    import mindspore.nn as nn
    from mindspore import Tensor
    import mindspore.ops as ops

    class DonorMatchNet(nn.Cell):
        """Neural donor-recipient matching model."""

        def __init__(self, donor_features=18, request_features=14, hidden_dim=128, dropout=0.2):
            super(DonorMatchNet, self).__init__()
            combined_dim = donor_features + request_features
            self.network = nn.SequentialCell([
                nn.Dense(combined_dim, hidden_dim),
                nn.ReLU(),
                nn.BatchNorm1d(hidden_dim),
                nn.Dropout(p=dropout),
                nn.Dense(hidden_dim, 64),
                nn.ReLU(),
                nn.BatchNorm1d(64),
                nn.Dropout(p=dropout),
                nn.Dense(64, 32),
                nn.ReLU(),
                nn.Dense(32, 1),
                nn.Sigmoid(),
            ])

        def construct(self, donor_x, request_x):
            combined = ops.concat((donor_x, request_x), axis=1)
            return self.network(combined)

    class DonorMatchAttention(nn.Cell):
        """Attention-based donor matching for ranking multiple donors per request."""

        def __init__(self, donor_features=18, request_features=14, d_model=64, nhead=4, dropout=0.1):
            super(DonorMatchAttention, self).__init__()
            self.donor_proj = nn.Dense(donor_features, d_model)
            self.request_proj = nn.Dense(request_features, d_model)
            self.attention = nn.MultiheadAttention(
                embed_dim=d_model, num_heads=nhead, dropout=dropout, batch_first=True,
            )
            self.score_head = nn.SequentialCell([
                nn.Dense(d_model, 32), nn.ReLU(), nn.Dense(32, 1), nn.Sigmoid(),
            ])

        def construct(self, donor_pool, request):
            donor_emb = self.donor_proj(donor_pool)
            request_emb = self.request_proj(request)
            attended, _ = self.attention(request_emb, donor_emb, donor_emb)
            context = attended.expand_as(donor_emb)
            enriched = donor_emb + context
            return self.score_head(enriched)

    def build_match_model(model_type='basic', **kwargs):
        """Factory function for donor matching models."""
        if model_type == 'basic':
            return DonorMatchNet(**kwargs)
        elif model_type == 'attention':
            return DonorMatchAttention(**kwargs)
        else:
            raise ValueError(f"Unknown model type: {model_type}")

except ImportError:
    # MindSpore not installed — model classes unavailable, but constants work
    DonorMatchNet = None
    DonorMatchAttention = None

    def build_match_model(model_type='basic', **kwargs):
        raise ImportError("MindSpore is required. Install: pip install mindspore")
