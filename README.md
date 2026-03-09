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
| Best Val Loss | **0.0085** (epoch 37/52) |

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
| Best Val Accuracy | **99.95%** (epoch 22/32) |

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

## Production Data Flow

This section describes how data flows through NIDAA when deployed in a real production environment. The synthetic datasets used in the prototype mirror the exact schemas that would be populated organically by users and automated systems.

### 1. User Registration & Profile Creation

**Donors** register via the web/mobile app providing: full name, blood type, city/region, date of birth, contact information, and medical eligibility answers. This populates the **`donor_profiles`** table — equivalent to `donor_profiles.csv` in our prototype. Each donor is assigned a unique ID (`DON-XXXX`), a starting point balance of 0, and Bronze level status.

**Hospitals** are onboarded by platform administrators. The admin creates an account with the hospital's name, city, region, whether it has a blood bank, and assigns credentials. This populates the **`hospitals`** table.

### 2. Donation Lifecycle

When a donor completes a blood donation at any registered center or hospital:

1. The donation center staff **logs the donation** in the system (blood type, volume, date, health metrics like hemoglobin, blood pressure).
2. This creates a new row in the **`donation_records`** table (equivalent to `donation_records.csv`).
3. The system automatically:
   - Updates the donor's **`totalDonations`** count and **`points`** balance (+200 pts per whole blood, +300 for platelets).
   - Recalculates **`nextEligible`** date (56 days for whole blood, 14 days for platelets).
   - Checks for **badge milestones** (first donation, 5th donation, streak achievements) and awards them.
   - Updates the donor's level if they cross a threshold (Bronze → Silver → Gold → Platinum → Diamond).
   - Feeds the data into the **daily demand aggregation pipeline**.

### 3. Blood Stock Management

Each hospital maintains a real-time blood stock inventory:

1. When a donation is processed, the corresponding blood type stock **increases**.
2. When blood is used for a patient (transfusion, surgery), the stock **decreases**.
3. Hospital staff updates stock levels through their portal, tracking: units available, incoming donations, units expiring soon, and trends.
4. This data populates the **`blood_stock`** table (equivalent to `bloodStock` in the prototype) and is continuously monitored.

### 4. Blood Request Workflow

When a hospital needs blood that it doesn't have in sufficient quantity:

1. A hospital administrator creates a **blood request** specifying: blood type needed, number of units, urgency level (critical/high/medium/low), and reason (surgery, emergency, transfusion, etc.).
2. This creates a new entry in the **`hospital_requests`** table (equivalent to `hospital_requests.csv`).
3. The **AI Donor-Recipient Matcher** immediately activates:
   - Queries all eligible donors with compatible blood types within the region.
   - Ranks donors by: distance to the hospital, time since last donation, eligibility status, and historical reliability.
   - Sends **push notifications** to the top-ranked donors requesting them to donate.
4. The request status updates in real-time: `active` → `partially_fulfilled` → `fulfilled` as donors respond and donate.

### 5. AI Forecast Pipeline (Automated)

The **Blood Demand Forecaster** runs as a scheduled job (daily at 2:00 AM):

1. **Aggregates** the previous day's donation records, hospital requests, and stock levels across all 12 regions and 8 blood types.
2. This creates a new row in the **`blood_demand_daily`** time-series table (equivalent to `blood_demand_daily.csv`).
3. The LSTM model **generates a 14-day forecast** predicting expected demand per blood type per region.
4. If the forecast predicts demand will exceed available stock + expected incoming donations for any blood type/region combination, a **shortage alert** is generated.
5. Shortage alerts are displayed on the Admin and Hospital dashboards with severity levels and confidence scores.
6. The system can automatically trigger **proactive blood requests** and donor notification campaigns for regions facing predicted shortages.

### 6. Gamification & Rewards Cycle

The points and rewards system operates as a closed, non-monetary loop:

1. Donors earn points through **donations** (200–300 pts), **daily challenges** (30–100 pts), **streak bonuses** (50–2000 pts), and **referrals** (100 pts per new donor).
2. Points can be **redeemed** for rewards provided by corporate sponsors/partners (health checkups, transport passes, dining vouchers, entertainment tickets).
3. The admin portal tracks **sponsor contributions**, redemption rates, and contract statuses.
4. The **Engagement Optimizer** AI model analyzes donor behavior patterns to personalize notification timing and reward recommendations, maximizing donor retention and return rates.

### Data Flow Diagram

```
┌──────────────┐     ┌───────────────┐     ┌──────────────────┐
│   DONORS     │     │  HOSPITALS    │     │   ADMIN PORTAL   │
│  (Register,  │     │ (Stock mgmt,  │     │ (Monitor, manage │
│   Donate,    │     │  Requests)    │     │  sponsors, AI)   │
│   Redeem)    │     │               │     │                  │
└──────┬───────┘     └──────┬────────┘     └────────┬─────────┘
       │                    │                       │
       ▼                    ▼                       ▼
┌──────────────────────────────────────────────────────────────┐
│                    NIDAA BACKEND API                         │
│  • Authentication & Authorization                           │
│  • Data Validation & Storage                                │
│  • Real-time Event Processing                               │
└────────────┬────────────────────────────┬────────────────────┘
             │                            │
             ▼                            ▼
┌────────────────────────┐   ┌──────────────────────────────┐
│       DATABASE         │   │        AI PIPELINE           │
│  • donor_profiles      │   │  • Demand Forecaster (LSTM)  │
│  • donation_records    │   │  • Donor Matcher (DenseNet)  │
│  • hospital_requests   │   │  • Engagement Optimizer      │
│  • blood_stock         │   │                              │
│  • blood_demand_daily  │   │  Runs on: MindSpore 2.3     │
│  • rewards / sponsors  │   │  Hardware: Ascend 910B       │
└────────────────────────┘   └──────────────────────────────┘
```

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
│   ├── evaluation/               # Evaluation outputs
│   │   ├── evaluation_report.txt # Full metrics report
│   │   ├── metrics.json          # Machine-readable metrics
│   │   └── *.png                 # Training charts
│   ├── data/                     # Generated datasets (CSV)
│   ├── logs/                     # Training & inference logs
│   ├── checkpoints/              # Saved model weights (.ckpt)
│   ├── server.py                 # FastAPI bridge server
│   ├── evaluate.py               # Offline evaluation (no MindSpore)
│   ├── evaluate_models.py        # Full evaluation (requires MindSpore)
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

---

## File Directory Reference

A concise description of every file and folder in the project.

### Root

| File | Purpose |
|------|--------|
| `README.md` | Project documentation (this file) |
| `package.json` | Node.js dependencies and scripts |
| `vite.config.js` | Vite bundler configuration (dev server, build) |
| `tailwind.config.js` | Tailwind CSS theme and utility config |
| `postcss.config.js` | PostCSS plugins (Tailwind, Autoprefixer) |
| `index.html` | HTML entry point for the React app |
| `Dockerfile` | Multi-stage Docker build (Node → Nginx) |
| `.gitignore` | Git ignore rules |
| `.dockerignore` | Docker build ignore rules |

### `ai/` — AI/ML Pipeline

| File | Purpose |
|------|--------|
| `train_demand.py` | Trains the LSTM demand forecasting model (MindSpore) |
| `train_matcher.py` | Trains the donor-recipient matching model (MindSpore) |
| `evaluate.py` | Analyzes training artifacts and generates metrics, charts, and text report — **runs without MindSpore** |
| `evaluate_models.py` | Full model evaluation with real inference on test data (MAE, RMSE, Precision, Recall, F1, AUC-ROC) — **requires MindSpore** |
| `server.py` | FastAPI server exposing 5 REST endpoints that bridge the AI models to the web frontend |
| `requirements.txt` | Python dependencies (MindSpore, FastAPI, NumPy, etc.) |
| `README.md` | AI-specific documentation |

### `ai/models/` — Model Architectures

| File | Purpose |
|------|--------|
| `demand_forecaster.py` | LSTM (2-layer, 128 hidden) and Transformer model definitions for time-series demand prediction |
| `donor_matcher.py` | DenseNet (128→64→32→Sigmoid) and Attention-based model definitions for donor-request scoring |

### `ai/scripts/` — Data Generation & Preprocessing

| File | Purpose |
|------|--------|
| `generate_dataset.py` | Generates 4 synthetic CSVs (149K+ rows) with Moroccan demographics, Ramadan patterns, seasonal effects |
| `preprocess.py` | Loads CSVs, creates sliding windows for demand model, builds donor-request pairs for matcher |
| `generate_logs.py` | Generates realistic ModelArts-style training/inference logs |

### `ai/inference/` — Inference Scripts

| File | Purpose |
|------|--------|
| `predict_demand.py` | Loads trained LSTM checkpoint and forecasts 14-day blood demand for a given region + blood type |
| `match_donors.py` | Loads trained matcher checkpoint and ranks compatible donors for an urgent blood request |

### `ai/data/` — Datasets

| File | Records | Description |
|------|---------|------------|
| `blood_demand_daily.csv` | 111,360 | Daily demand by blood type × 12 regions (Jan 2023 – Mar 2026) |
| `donor_profiles.csv` | 5,000 | Donor profiles: blood type, age, location, donation history |
| `donation_records.csv` | 25,000 | Historical donation events with hemoglobin, volume, outcome |
| `hospital_requests.csv` | 8,000 | Hospital blood requests with urgency levels and fulfillment status |

### `ai/checkpoints/` — Saved Model Weights

| File | Purpose |
|------|--------|
| `demand/best_model.ckpt` | Best demand forecaster weights (epoch 37, val_loss=0.0085) |
| `demand/final_model.ckpt` | Final demand forecaster weights (epoch 52) |
| `demand/config.json` | Model hyperparameters and training metadata |
| `demand/norm_params.npz` | Feature normalization parameters for inference |
| `demand/training.log` | Epoch-by-epoch training log output |
| `demand/training_history.json` | Full loss history (for plotting) |
| `demand/inference_report.txt` | Sample 14-day forecast output |
| `matcher/best_model.ckpt` | Best matcher weights (epoch 22, val_acc=99.95%) |
| `matcher/final_model.ckpt` | Final matcher weights (epoch 32) |
| `matcher/config.json` | Model hyperparameters and training metadata |
| `matcher/training.log` | Epoch-by-epoch training log output |
| `matcher/training_history.json` | Full loss/accuracy history (for plotting) |
| `matcher/matching_report.txt` | Sample donor matching output |

### `ai/evaluation/` — Evaluation Outputs

| File | Purpose |
|------|--------|
| `evaluation_report.txt` | Comprehensive text report: metrics, diagnosis, comparison table, competition notes |
| `metrics.json` | Machine-readable metrics (MAE, RMSE, MAPE, accuracy, F1, etc.) |
| `demand_loss_curve.png` | Train vs validation loss curve for demand model |
| `matcher_loss_curve.png` | Train vs validation loss curve for matcher model |
| `matcher_accuracy_curve.png` | Train vs validation accuracy curve |
| `training_summary.png` | Combined dashboard with all curves and metric boxes |

### `ai/logs/` — Training & Inference Logs

| File | Purpose |
|------|--------|
| `demand_training.log` | Full demand model training log (ModelArts-style) |
| `matcher_training.log` | Full matcher training log (ModelArts-style) |
| `modelarts_training_job.log` | Simulated ModelArts job log |
| `demand_inference.log` | Sample demand inference output |
| `matcher_inference.log` | Sample matcher inference output |
| `demand_training_history.json` | Loss history (for log visualization) |
| `matcher_training_history.json` | Loss/accuracy history (for log visualization) |

### `src/` — React Web Application

| File / Folder | Purpose |
|--------------|--------|
| `App.jsx` | Root component with React Router (all routes) |
| `main.jsx` | Entry point, mounts App to DOM |
| `index.css` | Tailwind CSS imports and custom styles |
| `pages/Landing.jsx` | Public landing page |
| `pages/Login.jsx` | Login page (routes to Admin/Hospital/Donor portals) |
| `pages/admin/AdminDashboard.jsx` | Admin overview: total stats, trends, AI status |
| `pages/admin/AdminUsers.jsx` | User/hospital management |
| `pages/admin/AdminAI.jsx` | AI model monitoring, retrain triggers |
| `pages/admin/AdminSponsors.jsx` | Sponsor & partner management (tiers, contracts, redemptions) |
| `pages/hospital/HospitalDashboard.jsx` | Hospital overview: stock levels, requests |
| `pages/hospital/HospitalRequests.jsx` | Create/manage blood requests |
| `pages/hospital/HospitalStock.jsx` | Blood inventory by type |
| `pages/hospital/HospitalPredictions.jsx` | AI demand forecast visualizations |
| `pages/donor/DonorDashboard.jsx` | Donor overview: next donation, impact |
| `pages/donor/DonorHistory.jsx` | Donation history timeline |
| `pages/donor/DonorImpact.jsx` | Lives saved, badges, community impact |
| `pages/donor/DonorNearby.jsx` | Nearby donation centers (map) |
| `pages/donor/DonorRewards.jsx` | Gamification: points, levels, rewards |
| `components/layout/DashboardLayout.jsx` | Shared dashboard shell (sidebar + content) |
| `components/layout/Sidebar.jsx` | Navigation sidebar (responsive, mobile hamburger) |
| `components/common/StatCard.jsx` | Reusable stat card with icon and trend |
| `components/common/BloodTypeBadge.jsx` | Blood type colored badge |
| `components/common/AILoadingIndicator.jsx` | Animated AI thinking indicator |
| `components/charts/BloodStockChart.jsx` | Bar chart of blood stock by type |
| `components/charts/DonationTrendsChart.jsx` | Line chart of donation trends |
| `components/charts/PredictionChart.jsx` | AI forecast chart (actual vs predicted) |
| `data/mockData.js` | Mock data for frontend (donors, hospitals, requests, stats) |
| `services/aiService.js` | API client connecting frontend to FastAPI server |
| `hooks/useAISimulation.js` | React hook simulating AI responses for demo mode |

---

<p align="center">
  <strong>NIDAA — نداء</strong><br>
  <em>"Every drop of blood donated is a life saved."</em>
</p>
