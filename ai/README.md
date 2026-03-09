# NIDAA AI Module

This directory contains the complete AI/ML pipeline:

## Structure
```
ai/
├── models/              # MindSpore model architectures
│   ├── demand_forecaster.py   # LSTM + Transformer for demand prediction
│   └── donor_matcher.py       # Neural network for donor-recipient matching
├── scripts/
│   ├── generate_dataset.py    # Synthetic data generator
│   ├── generate_logs.py       # Training log generator
│   └── preprocess.py          # Data preprocessing pipeline
├── inference/
│   ├── predict_demand.py      # Demand forecasting inference
│   └── match_donors.py        # Donor matching inference
├── data/                # Generated CSV datasets
├── logs/                # Training & inference logs
├── checkpoints/         # Saved model weights
├── train_demand.py      # Demand model training script
├── train_matcher.py     # Matcher model training script
├── server.py            # FastAPI REST API server
└── requirements.txt     # Python dependencies
```

## Quick Commands
```bash
# Generate datasets
python scripts/generate_dataset.py

# Train models
python train_demand.py --model lstm --epochs 100
python train_matcher.py --model basic --epochs 50

# Run inference
python inference/predict_demand.py
python inference/match_donors.py

# Start API server
python server.py
```
