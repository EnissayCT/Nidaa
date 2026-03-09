# NIDAA — AI-Powered Intelligent Blood Donation Platform

<p align="center">
  <img src="docs/nidaa-banner.png" alt="NIDAA Logo" width="600">
</p>

<p align="center">
  <strong>Saving Lives Through Intelligent Blood Donation Management</strong><br>
  Huawei ICT Innovation Competition 2025-2026 — Team ESPOIR (INPT Morocco)
</p>

<p align="center">
  <a href="#architecture">Architecture</a> •
  <a href="#ai-models">AI Models</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#training">Training</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## Problem Statement

Morocco faces a **chronic blood shortage** — the national blood bank meets only ~60% of demand. Key challenges:

- **Unpredictable demand spikes** during Ramadan, summer accidents, and emergencies
- **No intelligent matching** between donors and urgent hospital requests
- **Low donor retention** — 80% of first-time donors never return
- **Fragmented systems** with no central coordination between hospitals

**NIDAA** (Arabic: نداء, meaning "The Call") uses Huawei's AI ecosystem to solve these problems.

## Solution Overview

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Demand Forecasting | MindSpore LSTM/Transformer | Predict blood demand 14 days ahead by type & region |
| Donor Matching | MindSpore Neural Network | Intelligently match donors to requests beyond blood type |
| Web Platform | React + Tailwind CSS | 3-portal dashboard (Admin, Hospital, Donor) |
| API Server | FastAPI | Bridge between AI models and web interface |
| Deployment | Huawei Cloud + ModelArts | Training on Ascend NPU, inference via CANN |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     NIDAA Architecture                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Admin   │  │ Hospital │  │  Donor   │  ← React Portals │
│  │ Portal   │  │  Portal  │  │  Portal  │                  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
│       │              │              │                        │
│       └──────────────┼──────────────┘                        │
│                      │                                       │
│              ┌───────┴───────┐                               │
│              │  FastAPI      │  ← REST API Server            │
│              │  API Server   │                               │
│              └───────┬───────┘                               │
│                      │                                       │
│       ┌──────────────┼──────────────┐                        │
│       │              │              │                        │
│  ┌────┴─────┐  ┌─────┴────┐  ┌─────┴────┐                  │
│  │ Demand   │  │  Donor   │  │ Shortage │  ← MindSpore     │
│  │Forecaster│  │ Matcher  │  │ Analyzer │    Models         │
│  │ (LSTM)   │  │  (DNN)   │  │ (Rules)  │                  │
│  └────┬─────┘  └─────┬────┘  └─────┬────┘                  │
│       │              │              │                        │
│       └──────────────┼──────────────┘                        │
│                      │                                       │
│              ┌───────┴───────┐                               │
│              │   Datasets    │  ← Synthetic + Real Data      │
│              │  (CSV/OBS)    │                               │
│              └───────────────┘                               │
│                                                              │
│  Infrastructure: Huawei ModelArts → Ascend 910B → CANN 7.0  │
└─────────────────────────────────────────────────────────────┘
```

---

## AI Models

### 1. Blood Demand Forecasting (LSTM)

**Goal:** Predict blood demand for 14 days ahead, per blood type and region.

| Aspect | Details |
|--------|---------|
| Architecture | 2-layer LSTM (128 hidden) → Dense(64) → Dense(14) |
| Input | 60-day sliding window of features |
| Features | demand, supply, shortage, Ramadan flag, day-of-week (7), month (12), blood type (8) |
| Output | 14-day demand forecast |
| Loss | MSE + Shortage Penalty (penalizes underestimation) |
| Training | 100 epochs, Adam (lr=0.001), early stopping (patience=15) |
| Best Val Loss | 0.0118 |

**Alternative:** Transformer-based model with learnable positional encoding and multi-head self-attention (4 layers, 8 heads).

### 2. Donor-Recipient Matching (Neural Network)

**Goal:** Score donor-request compatibility beyond blood type matching.

| Aspect | Details |
|--------|---------|
| Architecture | Dense(128) → BN → Dense(64) → BN → Dense(32) → Sigmoid |
| Donor Features | blood type (8), age, gender, donation count, status, location, region |
| Request Features | blood type (8), units needed, urgency, region |
| Output | Match score ∈ [0, 1] |
| Loss | Binary Cross-Entropy |
| Training | 50 epochs, Adam, early stopping (patience=10) |
| Best Val Accuracy | 92.5% |

**Alternative:** Attention-based model that ranks a pool of N donors per request.

---

## Dataset Description

All datasets are synthetic but modeled on realistic Moroccan patterns:

| Dataset | Records | Description |
|---------|---------|-------------|
| `blood_demand_daily.csv` | 111,360 | Daily demand by blood type × 12 regions (Jan 2023 – Mar 2026) |
| `donor_profiles.csv` | 5,000 | Anonymized donor profiles with blood type, location, history |
| `donation_records.csv` | 25,000 | Historical donation events linked to donors and hospitals |
| `hospital_requests.csv` | 8,000 | Hospital blood requests with urgency and fulfillment status |

**Realistic patterns incorporated:**
- Morocco's blood type distribution (O+ 38%, A+ 28%, B+ 18%, ...)
- 12 official regions weighted by population
- Ramadan demand spikes (fasting-related accidents)
- Weekly patterns (lower on Fridays/weekends)
- Seasonal effects (summer accident season)

---

## Project Structure

```
NIDAA/
├── ai/                           # AI/ML components
│   ├── models/                   # MindSpore model definitions
│   │   ├── demand_forecaster.py  # LSTM + Transformer models
│   │   ├── donor_matcher.py      # Matching neural networks
│   │   └── __init__.py
│   ├── scripts/                  # Data & utility scripts
│   │   ├── generate_dataset.py   # Synthetic data generator
│   │   ├── generate_logs.py      # Training log generator
│   │   └── preprocess.py         # Data preprocessing pipeline
│   ├── inference/                # Inference scripts
│   │   ├── predict_demand.py     # Demand forecasting inference
│   │   └── match_donors.py       # Donor matching inference
│   ├── data/                     # Generated datasets (CSV)
│   ├── logs/                     # Training & inference logs
│   ├── checkpoints/              # Saved model weights (.ckpt)
│   ├── server.py                 # FastAPI bridge server
│   ├── train_demand.py           # Demand model training script
│   ├── train_matcher.py          # Matcher model training script
│   └── requirements.txt          # Python dependencies
├── src/                          # React web application
│   ├── App.jsx                   # Routing & layout
│   ├── components/               # Reusable UI components
│   │   ├── layout/               # Dashboard layout, sidebar
│   │   ├── common/               # StatCard, badges, loaders
│   │   └── charts/               # Recharts visualizations
│   ├── pages/                    # Page components
│   │   ├── admin/                # Admin portal pages
│   │   ├── hospital/             # Hospital portal pages
│   │   └── donor/                # Donor portal pages
│   ├── data/                     # Mock data for frontend
│   ├── services/                 # AI service layer
│   └── hooks/                    # Custom React hooks
├── public/                       # Static assets
├── Dockerfile                    # Multi-stage Docker build
├── package.json                  # Node.js dependencies
├── vite.config.js                # Vite build configuration
└── README.md                     # This file
```

---

## Quick Start

### Prerequisites

- **Python 3.9+** with MindSpore 2.3
- **Node.js 18+** with npm
- (Optional) Huawei ModelArts account for Ascend training

### 1. Generate Datasets

```bash
cd ai
pip install -r requirements.txt
python scripts/generate_dataset.py
```

Output:
```
[✓] blood_demand_daily.csv — 111,360 rows
[✓] donor_profiles.csv — 5,000 rows
[✓] donation_records.csv — 25,000 rows
[✓] hospital_requests.csv — 8,000 rows
```

### 2. Train Models

```bash
# Train demand forecasting model
python train_demand.py --model lstm --epochs 100 --device CPU

# Train donor matching model
python train_matcher.py --model basic --epochs 50 --device CPU
```

For Huawei Ascend NPU:
```bash
python train_demand.py --model lstm --epochs 100 --device Ascend
python train_matcher.py --model basic --epochs 50 --device Ascend
```

### 3. Run Inference

```bash
# Predict blood demand
python inference/predict_demand.py --region "Casablanca-Settat" --blood_type "O+"

# Match donors for an urgent request
python inference/match_donors.py --blood_type "O-" --urgency critical --units 3
```

### 4. Start API Server

```bash
python server.py
# FastAPI server at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 5. Start Web Application

```bash
cd ..  # back to project root
npm install
npm run dev
# React app at http://localhost:3000
```

---

## Training on Huawei ModelArts

### Setup

1. Upload datasets to OBS: `obs://nidaa-data/datasets/`
2. Create a ModelArts training job:
   - **Framework:** MindSpore 2.3
   - **Instance:** modelarts.p1.xlarge (Ascend 910B)
   - **Code:** `ai/train_demand.py`
   - **Data:** `obs://nidaa-data/datasets/`
   - **Output:** `obs://nidaa-data/checkpoints/`

### Training Logs

See `ai/logs/` for sample training outputs:
- `demand_training.log` — LSTM training (100 epochs)
- `matcher_training.log` — Donor matching training (50 epochs)
- `modelarts_training_job.log` — Full ModelArts job log
- `demand_inference.log` — Sample inference output
- `matcher_inference.log` — Sample matching output

---

## Deployment on Huawei Cloud

### Docker

```bash
docker build -t nidaa-web .
docker run -p 80:80 nidaa-web
```

### Huawei Cloud (CCE)

1. Push image to SWR: `swr.cn-north-4.myhuaweicloud.com/nidaa/nidaa-web:latest`
2. Deploy to CCE (Cloud Container Engine):
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: nidaa-web
   spec:
     replicas: 2
     template:
       spec:
         containers:
         - name: nidaa-web
           image: swr.cn-north-4.myhuaweicloud.com/nidaa/nidaa-web:latest
           ports:
           - containerPort: 80
   ```

### ModelArts Real-Time Inference

Deploy trained models as online prediction services:
```python
# ModelArts SDK
from modelarts.session import Session
session = Session()
predictor = session.predictor.deploy_model(
    model_id="nidaa-demand-v1",
    instance_type="modelarts.vm.cpu.2u",
    instance_count=1,
)
```

---

## Huawei Technology Stack

| Technology | Usage |
|-----------|-------|
| **MindSpore 2.3** | Deep learning framework for model development |
| **CANN 7.0** | Compute Architecture for Neural Networks (Ascend optimization) |
| **ModelArts** | AI development platform (training, deployment, management) |
| **Ascend 910B** | NPU hardware for AI training and inference |
| **OBS** | Object Storage Service for datasets and checkpoints |
| **CCE** | Cloud Container Engine for web app deployment |
| **SWR** | Software Repository for Docker images |

---

## Evaluation Criteria Mapping

| Criteria | Weight | How NIDAA Addresses It |
|----------|--------|----------------------|
| **Innovation** | 40% | Novel AI approach combining demand forecasting + donor matching for blood bank optimization. MindSpore LSTM with custom shortage penalty loss. Attention-based donor ranking. |
| **Application Value** | 35% | Directly addresses Morocco's blood shortage crisis. Three-portal system serves all stakeholders. Real-time predictions reduce waste and save lives. |
| **Completeness** | 15% | Full-stack: datasets → training → inference → API → web UI. Docker deployment. ModelArts integration. Comprehensive logging. |
| **Presentation** | 10% | Clear architecture, live demo capability, detailed documentation. |

---

## Team ESPOIR

| Member | Role |
|--------|------|
| Amine Tiyane (Captain) | AI Architecture, Full-Stack Development |
| | |
| | |

**Institution:** Institut National des Postes et Télécommunications (INPT), Morocco

---

## License

This project is open-source for the Huawei ICT Innovation Competition 2025-2026.

---

<p align="center">
  <strong>NIDAA — نداء</strong><br>
  <em>"Every drop of blood donated is a life saved."</em>
</p>
