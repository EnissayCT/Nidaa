"""
NIDAA — Synthetic Blood Demand Dataset Generator
=================================================
Generates realistic synthetic data for blood donation prediction,
simulating Moroccan hospital demand patterns.

This script creates:
  1. blood_demand_daily.csv   — Daily blood demand by type and region
  2. donor_profiles.csv       — Anonymized donor profiles
  3. donation_records.csv     — Historical donation records
  4. hospital_requests.csv    — Hospital blood request logs

Data is synthetic but modeled on realistic distributions:
  - Morocco's 12 regions
  - 8 blood types with Moroccan prevalence ratios
  - Seasonal, weekly, and event-based demand patterns
  - Ramadan, holiday, and accident-season effects
"""

import csv
import os
import random
import math
from datetime import datetime, timedelta

random.seed(42)

# ── Configuration ─────────────────────────────────────────────
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
os.makedirs(OUTPUT_DIR, exist_ok=True)

START_DATE = datetime(2023, 1, 1)
END_DATE = datetime(2026, 3, 6)
NUM_DAYS = (END_DATE - START_DATE).days

REGIONS = [
    'Rabat-Salé-Kénitra', 'Casablanca-Settat', 'Fès-Meknès',
    'Marrakech-Safi', 'Tanger-Tétouan-Al Hoceïma', 'Souss-Massa',
    'Oriental', 'Béni Mellal-Khénifra', 'Drâa-Tafilalet',
    'Laâyoune-Sakia El Hamra', 'Guelmim-Oued Noun', 'Dakhla-Oued Ed-Dahab',
]

# Blood type prevalence in Morocco (approximate)
BLOOD_TYPES = {
    'O+': 0.38, 'A+': 0.28, 'B+': 0.18, 'AB+': 0.06,
    'O-': 0.04, 'A-': 0.03, 'B-': 0.02, 'AB-': 0.01,
}

# Region population weights (relative)
REGION_WEIGHTS = {
    'Casablanca-Settat': 1.0, 'Rabat-Salé-Kénitra': 0.7,
    'Fès-Meknès': 0.6, 'Marrakech-Safi': 0.6,
    'Tanger-Tétouan-Al Hoceïma': 0.5, 'Souss-Massa': 0.4,
    'Oriental': 0.35, 'Béni Mellal-Khénifra': 0.3,
    'Drâa-Tafilalet': 0.2, 'Laâyoune-Sakia El Hamra': 0.1,
    'Guelmim-Oued Noun': 0.08, 'Dakhla-Oued Ed-Dahab': 0.05,
}

HOSPITALS = [
    ('CHU Ibn Sina', 'Rabat-Salé-Kénitra'),
    ('CHU Ibn Rochd', 'Casablanca-Settat'),
    ('CHU Hassan II', 'Fès-Meknès'),
    ('CHU Mohammed VI', 'Marrakech-Safi'),
    ('Hôpital Cheikh Zaïd', 'Rabat-Salé-Kénitra'),
    ('CHU Mohammed VI Tanger', 'Tanger-Tétouan-Al Hoceïma'),
    ('Hôpital Militaire Rabat', 'Rabat-Salé-Kénitra'),
    ('CHU Souss Massa', 'Souss-Massa'),
    ('Hôpital Régional Oujda', 'Oriental'),
    ('Centre Régional Transfusion Sanguine Rabat', 'Rabat-Salé-Kénitra'),
    ('Centre Régional Transfusion Sanguine Casablanca', 'Casablanca-Settat'),
    ('Centre Régional Transfusion Sanguine Fès', 'Fès-Meknès'),
]

# Ramadan approximate start dates (simplified)
RAMADAN_STARTS = {
    2023: datetime(2023, 3, 23), 2024: datetime(2024, 3, 12),
    2025: datetime(2025, 3, 1), 2026: datetime(2026, 2, 18),
}

FIRST_NAMES = [
    'Amine', 'Youssef', 'Mohamed', 'Fatima', 'Nadia', 'Salma',
    'Karim', 'Aicha', 'Omar', 'Meryem', 'Hassan', 'Laila',
    'Rachid', 'Sara', 'Hamza', 'Zineb', 'Khalid', 'Houda',
]

CITIES_BY_REGION = {
    'Rabat-Salé-Kénitra': ['Rabat', 'Salé', 'Kénitra', 'Témara'],
    'Casablanca-Settat': ['Casablanca', 'Mohammedia', 'Settat'],
    'Fès-Meknès': ['Fès', 'Meknès'],
    'Marrakech-Safi': ['Marrakech', 'Safi'],
    'Tanger-Tétouan-Al Hoceïma': ['Tanger', 'Tétouan'],
    'Souss-Massa': ['Agadir', 'Tiznit'],
    'Oriental': ['Oujda', 'Nador'],
    'Béni Mellal-Khénifra': ['Béni Mellal'],
    'Drâa-Tafilalet': ['Errachidia'],
    'Laâyoune-Sakia El Hamra': ['Laâyoune'],
    'Guelmim-Oued Noun': ['Guelmim'],
    'Dakhla-Oued Ed-Dahab': ['Dakhla'],
}


def is_ramadan(date):
    year = date.year
    if year in RAMADAN_STARTS:
        start = RAMADAN_STARTS[year]
        return start <= date < start + timedelta(days=30)
    return False


def seasonal_factor(date):
    """Seasonal demand multiplier: higher in summer (accidents), lower in winter."""
    day_of_year = date.timetuple().tm_yday
    return 1.0 + 0.15 * math.sin(2 * math.pi * (day_of_year - 80) / 365)


def weekly_factor(date):
    """Weekday effect: lower on weekends."""
    dow = date.weekday()
    if dow == 4:  # Friday
        return 0.75
    if dow == 5:  # Saturday
        return 0.65
    if dow == 6:  # Sunday
        return 0.80
    return 1.0


def ramadan_factor(date):
    """Demand spike during Ramadan (more accidents, less donations)."""
    return 1.25 if is_ramadan(date) else 1.0


# ── 1. Generate Daily Blood Demand ───────────────────────────
def generate_blood_demand():
    rows = []
    for day_offset in range(NUM_DAYS):
        date = START_DATE + timedelta(days=day_offset)
        s_factor = seasonal_factor(date)
        w_factor = weekly_factor(date)
        r_factor = ramadan_factor(date)

        for region in REGIONS:
            base = 40 * REGION_WEIGHTS[region]
            for bt, prevalence in BLOOD_TYPES.items():
                demand = base * prevalence * s_factor * w_factor * r_factor
                demand = max(0, int(demand + random.gauss(0, demand * 0.15)))
                supply = max(0, int(demand * random.uniform(0.6, 1.3)))
                shortage = max(0, demand - supply)
                rows.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'region': region,
                    'blood_type': bt,
                    'demand_units': demand,
                    'supply_units': supply,
                    'shortage_units': shortage,
                    'is_ramadan': int(is_ramadan(date)),
                    'day_of_week': date.weekday(),
                    'month': date.month,
                })

    path = os.path.join(OUTPUT_DIR, 'blood_demand_daily.csv')
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"[✓] blood_demand_daily.csv — {len(rows)} rows")
    return rows


# ── 2. Generate Donor Profiles ────────────────────────────────
def generate_donors(n=5000):
    rows = []
    for i in range(1, n + 1):
        region = random.choices(REGIONS, weights=[REGION_WEIGHTS[r] for r in REGIONS])[0]
        city = random.choice(CITIES_BY_REGION[region])
        bt = random.choices(list(BLOOD_TYPES.keys()), weights=list(BLOOD_TYPES.values()))[0]
        age = random.randint(18, 65)
        gender = random.choice(['M', 'F'])
        total_donations = max(0, int(random.expovariate(0.15)))
        active = random.random() > 0.3
        reg_date = START_DATE + timedelta(days=random.randint(0, NUM_DAYS - 1))

        rows.append({
            'donor_id': f'DON-{i:05d}',
            'blood_type': bt,
            'age': age,
            'gender': gender,
            'city': city,
            'region': region,
            'total_donations': total_donations,
            'is_active': int(active),
            'registration_date': reg_date.strftime('%Y-%m-%d'),
            'last_donation_date': (reg_date + timedelta(days=random.randint(30, 365))).strftime('%Y-%m-%d') if total_donations > 0 else '',
            'latitude': round(random.uniform(29.0, 35.9), 4),
            'longitude': round(random.uniform(-9.8, -1.0), 4),
        })

    path = os.path.join(OUTPUT_DIR, 'donor_profiles.csv')
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"[✓] donor_profiles.csv — {len(rows)} rows")
    return rows


# ── 3. Generate Donation Records ──────────────────────────────
def generate_donations(donors, n=25000):
    rows = []
    for i in range(1, n + 1):
        donor = random.choice(donors)
        date = START_DATE + timedelta(days=random.randint(0, NUM_DAYS - 1))
        hospital = random.choice(HOSPITALS)
        volume = random.choice([200, 350, 450, 450, 450])  # most are 450ml
        hemoglobin = round(random.gauss(13.8, 0.8), 1)
        bp_sys = random.randint(110, 140)
        bp_dia = random.randint(65, 90)
        successful = random.random() > 0.05  # 95% success rate

        rows.append({
            'donation_id': f'DN-{i:06d}',
            'donor_id': donor['donor_id'],
            'date': date.strftime('%Y-%m-%d'),
            'hospital': hospital[0],
            'region': hospital[1],
            'blood_type': donor['blood_type'],
            'volume_ml': volume,
            'donation_type': random.choice(['Whole Blood', 'Whole Blood', 'Whole Blood', 'Platelets']),
            'hemoglobin': hemoglobin,
            'blood_pressure': f'{bp_sys}/{bp_dia}',
            'successful': int(successful),
        })

    path = os.path.join(OUTPUT_DIR, 'donation_records.csv')
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"[✓] donation_records.csv — {len(rows)} rows")


# ── 4. Generate Hospital Requests ─────────────────────────────
def generate_requests(n=8000):
    rows = []
    urgencies = ['critical', 'high', 'medium', 'low']
    reasons = [
        'Emergency Surgery', 'Scheduled Transfusion', 'Maternal Care',
        'Accident Emergency', 'Post-Operative Care', 'Chronic Disease Treatment',
        'Pediatric Care', 'Organ Transplant', 'Burn Treatment',
    ]

    for i in range(1, n + 1):
        hospital = random.choice(HOSPITALS)
        date = START_DATE + timedelta(days=random.randint(0, NUM_DAYS - 1))
        bt = random.choices(list(BLOOD_TYPES.keys()), weights=list(BLOOD_TYPES.values()))[0]
        urgency = random.choices(urgencies, weights=[0.15, 0.25, 0.35, 0.25])[0]
        units = random.randint(1, 10) if urgency == 'critical' else random.randint(1, 6)
        fulfilled = random.random() > 0.15
        response_min = random.randint(3, 60) if fulfilled else None

        rows.append({
            'request_id': f'REQ-{date.year}-{i:05d}',
            'date': date.strftime('%Y-%m-%d'),
            'hospital': hospital[0],
            'region': hospital[1],
            'blood_type': bt,
            'units_requested': units,
            'urgency': urgency,
            'reason': random.choice(reasons),
            'fulfilled': int(fulfilled),
            'response_time_min': response_min if response_min else '',
            'donors_matched': random.randint(1, 12) if fulfilled else 0,
        })

    path = os.path.join(OUTPUT_DIR, 'hospital_requests.csv')
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"[✓] hospital_requests.csv — {len(rows)} rows")


# ── Main ──────────────────────────────────────────────────────
if __name__ == '__main__':
    print("=" * 60)
    print("NIDAA — Synthetic Dataset Generator")
    print("=" * 60)
    generate_blood_demand()
    donors = generate_donors(5000)
    generate_donations(donors, 25000)
    generate_requests(8000)
    print("=" * 60)
    print("All datasets generated in: data/")
    print("=" * 60)
