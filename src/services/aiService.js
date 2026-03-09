// ============================================================
// NIDAA — AI Service Layer
// ============================================================
// This module is the single integration point for all AI models.
// Currently returns simulated data for the prototype.
//
// ── To integrate real MindSpore / ModelArts models: ──────────
// 1. Set VITE_AI_API_URL in your .env to the ModelArts endpoint
// 2. Replace the simulated functions below with fetch() calls
// 3. Add Huawei Cloud IAM authentication headers
// ============================================================

const AI_BASE_URL = import.meta.env.VITE_AI_API_URL || 'https://api.nidaa.ai/v1';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Random jitter to make simulations feel organic
const jitter = (base, range) => base + (Math.random() - 0.5) * range;

// ── Blood Demand Prediction ──────────────────────────────────
export async function predictBloodDemand(region = 'all', days = 7) {
  await delay(2200);
  const predictions = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const base = 40 + Math.sin(i * 0.6) * 10;
    const predicted = Math.round(jitter(base, 8));
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      predicted,
      lower: Math.round(predicted * 0.8),
      upper: Math.round(predicted * 1.2),
      riskLevel: predicted > 50 ? 'high' : predicted > 38 ? 'medium' : 'low',
    };
  });

  return {
    region,
    confidence: +(jitter(0.87, 0.06)).toFixed(2),
    predictions,
    alerts: predictions.filter((p) => p.riskLevel === 'high').length,
    modelVersion: 'v2.1.0',
    framework: 'MindSpore 2.3',
    computeTime: `${Math.round(jitter(145, 40))}ms`,
  };
}

// ── Donor–Recipient Matching ─────────────────────────────────
export async function matchDonors(requestId, bloodType, urgency) {
  await delay(1800);
  const donors = [
    { id: 'DON-4821', name: 'Amine T.', bloodType: 'O+', distance: '2.3 km', score: 0.96, eligible: true, lastDonation: '2026-02-15' },
    { id: 'DON-1092', name: 'Fatima Z.', bloodType, distance: '4.7 km', score: 0.92, eligible: true, lastDonation: '2025-12-20' },
    { id: 'DON-3384', name: 'Youssef M.', bloodType, distance: '6.1 km', score: 0.89, eligible: true, lastDonation: '2026-01-10' },
    { id: 'DON-5567', name: 'Nadia L.', bloodType, distance: '8.5 km', score: 0.84, eligible: true, lastDonation: '2025-11-30' },
    { id: 'DON-2201', name: 'Karim H.', bloodType, distance: '12.3 km', score: 0.78, eligible: false, lastDonation: '2026-02-28' },
  ];

  return {
    requestId,
    matchedDonors: donors,
    totalCandidates: 47,
    matchConfidence: +(jitter(0.92, 0.05)).toFixed(2),
    computeTime: `${Math.round(jitter(89, 20))}ms`,
  };
}

// ── Shortage Risk Analysis ───────────────────────────────────
export async function analyzeShortageRisk(region = 'all') {
  await delay(2500);
  return {
    overallRisk: 'moderate',
    riskScore: +(jitter(0.42, 0.15)).toFixed(2),
    criticalTypes: ['O-', 'AB-', 'B-'],
    recommendations: [
      'Activate SMS campaign targeting O- donors in Rabat-Salé-Kénitra',
      'Schedule mobile donation unit at INPT campus within 48 hours',
      'Coordinate with CHU Ibn Rochd for inter-hospital B- transfer',
      'Increase engagement notifications for inactive AB- donors in Fès',
    ],
    confidence: +(jitter(0.88, 0.06)).toFixed(2),
  };
}

// ── Engagement Scoring ───────────────────────────────────────
export async function getEngagementInsights(donorId) {
  await delay(1200);
  return {
    donorId,
    engagementScore: +(jitter(82, 12)).toFixed(0),
    predictedChurnRisk: 'low',
    optimalNotificationTime: '09:00 AM',
    recommendedActions: [
      'Send impact story about last donation',
      'Remind about upcoming eligibility on Apr 15',
      'Highlight position #42 on leaderboard',
    ],
  };
}
