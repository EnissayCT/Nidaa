"""
NIDAA — Blood Demand Forecasting Model (MindSpore)
====================================================
LSTM-based time-series model that predicts future blood demand
by type and region using historical demand patterns.

Architecture:
  Input (features) → LSTM(128) → LSTM(64) → Dense(32) → Dense(forecast_horizon)

Features per timestep:
  - demand_units (target, lagged)
  - supply_units
  - shortage_units
  - is_ramadan
  - day_of_week (one-hot, 7)
  - month (one-hot, 12)
  - blood_type (one-hot, 8)
  - region_weight (scalar)

Designed for MindSpore 2.3+ / Huawei ModelArts
"""

try:
    import mindspore as ms
    import mindspore.nn as nn
    from mindspore import Tensor, Parameter
    import mindspore.ops as ops

    class DemandForecastLSTM(nn.Cell):
        """LSTM-based blood demand forecasting model."""

        def __init__(self, input_size=30, hidden_size=128, num_layers=2,
                     forecast_horizon=14, dropout=0.2):
            super(DemandForecastLSTM, self).__init__()
            self.hidden_size = hidden_size
            self.num_layers = num_layers
            self.forecast_horizon = forecast_horizon
            self.lstm = nn.LSTM(
                input_size=input_size, hidden_size=hidden_size,
                num_layers=num_layers, batch_first=True, dropout=dropout,
            )
            self.fc = nn.SequentialCell([
                nn.Dense(hidden_size, 64), nn.ReLU(), nn.Dropout(p=dropout),
                nn.Dense(64, 32), nn.ReLU(),
                nn.Dense(32, forecast_horizon),
            ])

        def construct(self, x):
            lstm_out, _ = self.lstm(x)
            last_out = lstm_out[:, -1, :]
            predictions = self.fc(last_out)
            predictions = ops.relu(predictions)
            return predictions

    class DemandForecastTransformer(nn.Cell):
        """Transformer-based alternative for blood demand forecasting."""

        def __init__(self, input_size=30, d_model=128, nhead=8, num_layers=4,
                     forecast_horizon=14, dropout=0.1):
            super(DemandForecastTransformer, self).__init__()
            self.d_model = d_model
            self.forecast_horizon = forecast_horizon
            self.input_projection = nn.Dense(input_size, d_model)
            self.pos_embedding = Parameter(
                Tensor(ms.numpy.randn(1, 365, d_model).asnumpy(), ms.float32),
                name='pos_embedding',
            )
            encoder_layer = nn.TransformerEncoderLayer(
                d_model=d_model, nhead=nhead, dim_feedforward=d_model * 4,
                dropout=dropout, batch_first=True,
            )
            self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
            self.output_head = nn.SequentialCell([
                nn.Dense(d_model, 64), nn.GELU(approximate=False),
                nn.Dense(64, forecast_horizon),
            ])

        def construct(self, x):
            batch_size, seq_len, _ = x.shape
            x = self.input_projection(x)
            x = x + self.pos_embedding[:, :seq_len, :]
            x = self.transformer_encoder(x)
            x = ops.mean(x, axis=1)
            predictions = self.output_head(x)
            predictions = ops.relu(predictions)
            return predictions

    def build_demand_model(model_type='lstm', **kwargs):
        """Factory function to create a demand forecasting model."""
        if model_type == 'lstm':
            return DemandForecastLSTM(**kwargs)
        elif model_type == 'transformer':
            return DemandForecastTransformer(**kwargs)
        else:
            raise ValueError(f"Unknown model type: {model_type}. Use 'lstm' or 'transformer'.")

except ImportError:
    DemandForecastLSTM = None
    DemandForecastTransformer = None

    def build_demand_model(model_type='lstm', **kwargs):
        raise ImportError("MindSpore is required. Install: pip install mindspore")
