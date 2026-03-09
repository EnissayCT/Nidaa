// ============================================================
// NIDAA Platform — Mock Data Layer
// ============================================================
// All data is simulated for prototype demonstration.
// Replace with real API calls when connecting to backend.
// ============================================================

export const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ── Blood Stock ──────────────────────────────────────────────
export const bloodStock = [
  { type: 'A+', units: 145, capacity: 200, incoming: 12, expiringSoon: 8, trend: 'stable' },
  { type: 'A-', units: 23, capacity: 100, incoming: 3, expiringSoon: 5, trend: 'declining' },
  { type: 'B+', units: 112, capacity: 180, incoming: 8, expiringSoon: 4, trend: 'rising' },
  { type: 'B-', units: 15, capacity: 80, incoming: 2, expiringSoon: 3, trend: 'critical' },
  { type: 'AB+', units: 67, capacity: 120, incoming: 5, expiringSoon: 2, trend: 'stable' },
  { type: 'AB-', units: 8, capacity: 60, incoming: 1, expiringSoon: 2, trend: 'critical' },
  { type: 'O+', units: 189, capacity: 250, incoming: 15, expiringSoon: 10, trend: 'rising' },
  { type: 'O-', units: 31, capacity: 150, incoming: 4, expiringSoon: 7, trend: 'declining' },
];

// ── Demand Forecast (14 days) ────────────────────────────────
export const demandForecast = Array.from({ length: 14 }, (_, i) => {
  const date = new Date(2026, 2, 6);
  date.setDate(date.getDate() + i);
  const base = 42 + Math.sin(i * 0.7) * 12;
  const predicted = Math.round(base + (i % 3) * 3);
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    predicted,
    actual: i < 4 ? Math.round(predicted + (i % 2 === 0 ? 3 : -2)) : null,
    lower: Math.round(predicted * 0.82),
    upper: Math.round(predicted * 1.18),
  };
});

// ── Historical Donation Trends (30 days) ─────────────────────
export const donationTrends = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 2, 6);
  date.setDate(date.getDate() - 29 + i);
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    donations: Math.round(38 + Math.sin(i * 0.4) * 12 + (i % 5) * 2),
    requests: Math.round(34 + Math.cos(i * 0.3) * 10 + (i % 4) * 2),
  };
});

// ── Hospitals ────────────────────────────────────────────────
export const hospitals = [
  { id: 1, name: 'CHU Ibn Sina', city: 'Rabat', region: 'Rabat-Salé-Kénitra', distance: 2.3, urgentNeeds: ['O-', 'A-'], bloodBank: true, rating: 4.8, waitTime: '15 min', phone: '+212 537 67 28 71' },
  { id: 2, name: 'CHU Ibn Rochd', city: 'Casablanca', region: 'Casablanca-Settat', distance: 87.5, urgentNeeds: ['B-', 'AB-'], bloodBank: true, rating: 4.6, waitTime: '20 min', phone: '+212 522 48 20 20' },
  { id: 3, name: 'CHU Hassan II', city: 'Fès', region: 'Fès-Meknès', distance: 198.0, urgentNeeds: ['O-'], bloodBank: true, rating: 4.7, waitTime: '10 min', phone: '+212 535 61 91 53' },
  { id: 4, name: 'CHU Mohammed VI', city: 'Marrakech', region: 'Marrakech-Safi', distance: 322.0, urgentNeeds: [], bloodBank: true, rating: 4.5, waitTime: '25 min', phone: '+212 524 30 47 41' },
  { id: 5, name: 'Hôpital Cheikh Zaïd', city: 'Rabat', region: 'Rabat-Salé-Kénitra', distance: 4.1, urgentNeeds: ['A-', 'B-'], bloodBank: true, rating: 4.9, waitTime: '12 min', phone: '+212 537 86 86 86' },
  { id: 6, name: 'Centre Régional de Transfusion Sanguine', city: 'Rabat', region: 'Rabat-Salé-Kénitra', distance: 1.8, urgentNeeds: ['O-', 'AB-', 'B-'], bloodBank: true, rating: 4.7, waitTime: '5 min', phone: '+212 537 76 84 00' },
];

// ── Blood Requests ───────────────────────────────────────────
export const bloodRequests = [
  { id: 'REQ-2026-001', hospital: 'CHU Ibn Sina', city: 'Rabat', bloodType: 'O-', units: 5, urgency: 'critical', status: 'active', createdAt: '2026-03-05T10:30:00', reason: 'Emergency Surgery', matchedDonors: 3, responseTime: '8 min' },
  { id: 'REQ-2026-002', hospital: 'CHU Ibn Rochd', city: 'Casablanca', bloodType: 'A-', units: 3, urgency: 'high', status: 'active', createdAt: '2026-03-05T14:15:00', reason: 'Scheduled Transfusion', matchedDonors: 7, responseTime: '12 min' },
  { id: 'REQ-2026-003', hospital: 'Hôpital Cheikh Zaïd', city: 'Rabat', bloodType: 'B-', units: 2, urgency: 'medium', status: 'fulfilled', createdAt: '2026-03-04T09:00:00', reason: 'Maternal Care', matchedDonors: 5, responseTime: '22 min' },
  { id: 'REQ-2026-004', hospital: 'CHU Hassan II', city: 'Fès', bloodType: 'AB-', units: 4, urgency: 'critical', status: 'active', createdAt: '2026-03-06T07:45:00', reason: 'Accident Emergency', matchedDonors: 2, responseTime: '5 min' },
  { id: 'REQ-2026-005', hospital: 'CHU Mohammed VI', city: 'Marrakech', bloodType: 'O+', units: 6, urgency: 'low', status: 'fulfilled', createdAt: '2026-03-03T11:20:00', reason: 'Routine Stock Replenishment', matchedDonors: 12, responseTime: '45 min' },
  { id: 'REQ-2026-006', hospital: 'CHU Ibn Sina', city: 'Rabat', bloodType: 'A+', units: 3, urgency: 'medium', status: 'active', createdAt: '2026-03-06T08:00:00', reason: 'Post-Operative Care', matchedDonors: 8, responseTime: '15 min' },
];

// ── Current Donor Profile ────────────────────────────────────
export const currentDonor = {
  id: 'DON-4821',
  name: 'Amine Tiyane',
  email: 'aminetiyane@gmail.com',
  bloodType: 'O+',
  age: 23,
  city: 'Rabat',
  totalDonations: 12,
  totalVolume: '5,400 ml',
  memberSince: 'Jan 2024',
  nextEligible: '2026-04-15',
  points: 2400,
  level: 'Gold',
  rank: 42,
  streak: 5,
  badgeCount: 8,
  avatar: null,
};

// ── Donation History ─────────────────────────────────────────
export const donationHistory = [
  { id: 1, date: '2026-02-15', location: 'Centre Régional de Transfusion Sanguine, Rabat', type: 'Whole Blood', volume: '450 ml', status: 'completed', points: 200, hemoglobin: 14.2, bloodPressure: '120/80' },
  { id: 2, date: '2025-12-01', location: 'CHU Ibn Sina, Rabat', type: 'Whole Blood', volume: '450 ml', status: 'completed', points: 200, hemoglobin: 13.8, bloodPressure: '118/76' },
  { id: 3, date: '2025-09-20', location: 'Mobile Unit — INPT Campus', type: 'Whole Blood', volume: '450 ml', status: 'completed', points: 250, hemoglobin: 14.5, bloodPressure: '122/78' },
  { id: 4, date: '2025-07-10', location: 'CHU Ibn Sina, Rabat', type: 'Platelets', volume: '200 ml', status: 'completed', points: 300, hemoglobin: 14.0, bloodPressure: '116/74' },
  { id: 5, date: '2025-05-01', location: 'Centre Régional de Transfusion Sanguine, Rabat', type: 'Whole Blood', volume: '450 ml', status: 'completed', points: 200, hemoglobin: 13.5, bloodPressure: '120/82' },
  { id: 6, date: '2025-02-20', location: 'CHU Ibn Rochd, Casablanca', type: 'Whole Blood', volume: '450 ml', status: 'completed', points: 200, hemoglobin: 14.1, bloodPressure: '119/77' },
  { id: 7, date: '2024-12-15', location: 'CHU Ibn Sina, Rabat', type: 'Whole Blood', volume: '450 ml', status: 'completed', points: 200, hemoglobin: 13.9, bloodPressure: '121/79' },
  { id: 8, date: '2024-10-05', location: 'Mobile Unit — Mall of Rabat', type: 'Whole Blood', volume: '450 ml', status: 'completed', points: 250, hemoglobin: 14.3, bloodPressure: '118/75' },
];

// ── Blood Analysis ───────────────────────────────────────────
export const bloodAnalysis = [
  { date: '2026-02-15', hemoglobin: 14.2, hematocrit: 42.5, platelets: 245, wbc: 6.8, rbc: 4.9 },
  { date: '2025-12-01', hemoglobin: 13.8, hematocrit: 41.2, platelets: 238, wbc: 7.1, rbc: 4.7 },
  { date: '2025-09-20', hemoglobin: 14.5, hematocrit: 43.1, platelets: 251, wbc: 6.5, rbc: 5.0 },
  { date: '2025-07-10', hemoglobin: 14.0, hematocrit: 42.0, platelets: 242, wbc: 6.9, rbc: 4.8 },
  { date: '2025-05-01', hemoglobin: 13.5, hematocrit: 40.5, platelets: 235, wbc: 7.3, rbc: 4.6 },
  { date: '2025-02-20', hemoglobin: 14.1, hematocrit: 42.3, platelets: 248, wbc: 6.7, rbc: 4.9 },
];

// ── Impact Data ──────────────────────────────────────────────
export const impactData = {
  livesHelped: 8,
  emergenciesResolved: 3,
  surgeriesSupported: 5,
  childrenHelped: 2,
  recipients: [
    { id: 1, date: '2026-02-15', condition: 'Post-Surgical Recovery', outcome: 'Full Recovery', ageGroup: 'Adult (35–50)', hospital: 'CHU Ibn Sina' },
    { id: 2, date: '2025-12-01', condition: 'Accident Emergency', outcome: 'Stabilized & Recovered', ageGroup: 'Young Adult (18–25)', hospital: 'CHU Ibn Sina' },
    { id: 3, date: '2025-09-20', condition: 'Maternal Hemorrhage', outcome: 'Mother & Baby Safe', ageGroup: 'Adult (25–35)', hospital: 'CHU Ibn Rochd' },
    { id: 4, date: '2025-07-10', condition: 'Leukemia Treatment', outcome: 'Ongoing Treatment — Stable', ageGroup: 'Child (5–12)', hospital: 'CHU Ibn Sina' },
    { id: 5, date: '2025-05-01', condition: 'Scheduled Surgery', outcome: 'Successful Operation', ageGroup: 'Senior (60+)', hospital: 'Hôpital Cheikh Zaïd' },
    { id: 6, date: '2025-02-20', condition: 'Thalassemia Transfusion', outcome: 'Regular Treatment — Stable', ageGroup: 'Child (8–12)', hospital: 'CHU Ibn Rochd' },
    { id: 7, date: '2024-12-15', condition: 'Emergency Surgery', outcome: 'Full Recovery', ageGroup: 'Adult (40–55)', hospital: 'CHU Ibn Sina' },
    { id: 8, date: '2024-10-05', condition: 'Post-Accident Transfusion', outcome: 'Fully Recovered', ageGroup: 'Young Adult (20–30)', hospital: 'CHU Hassan II' },
  ],
};

// ── Gamification — Badges ────────────────────────────────────
export const badges = [
  { id: 1, name: 'First Drop', description: 'Complete your first donation', icon: '🩸', earned: true, date: '2024-01-15' },
  { id: 2, name: 'Regular Hero', description: 'Donate 5 times', icon: '🦸', earned: true, date: '2025-02-20' },
  { id: 3, name: 'Life Saver', description: 'Help save 5 lives', icon: '💗', earned: true, date: '2025-07-10' },
  { id: 4, name: 'Gold Donor', description: 'Reach Gold level', icon: '🏅', earned: true, date: '2025-09-20' },
  { id: 5, name: 'Streak Master', description: '5 consecutive on-time donations', icon: '🔥', earned: true, date: '2026-02-15' },
  { id: 6, name: 'Community Champion', description: 'Refer 10 new donors', icon: '👥', earned: false, progress: 60 },
  { id: 7, name: 'Platinum Hero', description: 'Donate 20 times', icon: '💎', earned: false, progress: 60 },
  { id: 8, name: 'Emergency Responder', description: 'Respond to 3 critical requests', icon: '🚨', earned: true, date: '2025-12-01' },
  { id: 9, name: 'Marathon Donor', description: 'Donate for 3 consecutive years', icon: '🏃', earned: false, progress: 80 },
  { id: 10, name: 'Blood Ambassador', description: 'Share 20 awareness posts', icon: '📢', earned: false, progress: 35 },
];

// ── Gamification — Leaderboard ───────────────────────────────
export const leaderboard = [
  { rank: 1, name: 'Fatima Z.', city: 'Casablanca', points: 4200, donations: 21, level: 'Platinum' },
  { rank: 2, name: 'Youssef M.', city: 'Rabat', points: 3800, donations: 19, level: 'Platinum' },
  { rank: 3, name: 'Aicha B.', city: 'Fès', points: 3500, donations: 17, level: 'Gold' },
  { rank: 4, name: 'Omar K.', city: 'Marrakech', points: 3200, donations: 16, level: 'Gold' },
  { rank: 5, name: 'Salma R.', city: 'Tanger', points: 3100, donations: 15, level: 'Gold' },
  { rank: 6, name: 'Karim H.', city: 'Rabat', points: 2900, donations: 14, level: 'Gold' },
  { rank: 7, name: 'Nadia L.', city: 'Casablanca', points: 2800, donations: 14, level: 'Gold' },
  { rank: 8, name: 'Hassan T.', city: 'Agadir', points: 2700, donations: 13, level: 'Gold' },
  { rank: 9, name: 'Meryem A.', city: 'Oujda', points: 2600, donations: 13, level: 'Gold' },
  { rank: 10, name: 'Rachid B.', city: 'Kénitra', points: 2500, donations: 12, level: 'Gold' },
  { rank: 42, name: 'Amine T.', city: 'Rabat', points: 2400, donations: 12, level: 'Gold', isCurrentUser: true },
];

// ── Platform Stats (Admin) ───────────────────────────────────
export const platformStats = {
  totalDonors: 15420,
  activeDonors: 8930,
  totalHospitals: 142,
  bloodBanks: 47,
  donationsToday: 847,
  donationsThisMonth: 23456,
  aiModelAccuracy: 87.3,
  matchSuccessRate: 92.1,
  avgResponseTime: '12 min',
  platformUptime: 99.97,
};

// ── Admin Users ──────────────────────────────────────────────
export const adminUsers = [
  { id: 1, name: 'Dr. Asmae Ait Mansour', email: 'asmae@inpt.ac.ma', role: 'admin', status: 'active', lastLogin: '2026-03-06T08:30:00', city: 'Rabat' },
  { id: 2, name: 'CHU Ibn Sina', email: 'admin@chu-ibnsin.ma', role: 'hospital', status: 'active', lastLogin: '2026-03-06T09:15:00', city: 'Rabat' },
  { id: 3, name: 'CHU Ibn Rochd', email: 'admin@chu-ibnrochd.ma', role: 'hospital', status: 'active', lastLogin: '2026-03-05T16:45:00', city: 'Casablanca' },
  { id: 4, name: 'Amine Tiyane', email: 'aminetiyane@gmail.com', role: 'donor', status: 'active', lastLogin: '2026-03-06T07:00:00', city: 'Rabat' },
  { id: 5, name: 'Fatima Zahra', email: 'fatima.z@email.com', role: 'donor', status: 'active', lastLogin: '2026-03-05T19:30:00', city: 'Casablanca' },
  { id: 6, name: 'CHU Hassan II', email: 'admin@chu-hassanii.ma', role: 'hospital', status: 'active', lastLogin: '2026-03-06T06:00:00', city: 'Fès' },
  { id: 7, name: 'Youssef Mansouri', email: 'youssef.m@email.com', role: 'donor', status: 'inactive', lastLogin: '2026-02-28T11:00:00', city: 'Rabat' },
  { id: 8, name: 'Centre Transfusion Rabat', email: 'admin@crts-rabat.ma', role: 'hospital', status: 'active', lastLogin: '2026-03-06T08:00:00', city: 'Rabat' },
];

// ── AI Model Metrics (Admin) ─────────────────────────────────
export const aiModels = [
  {
    id: 'demand-forecast-v2',
    name: 'Blood Demand Forecaster',
    description: 'Time-series model predicting blood demand by type and region using MindSpore',
    framework: 'MindSpore 2.3',
    accuracy: 87.3,
    lastTrained: '2026-03-01',
    status: 'active',
    inferenceTime: '145ms',
    dataPoints: '2.4M',
    version: 'v2.1.0',
  },
  {
    id: 'donor-match-v1',
    name: 'Donor–Recipient Matcher',
    description: 'Classification model for intelligent donor matching considering compatibility, distance, eligibility',
    framework: 'MindSpore 2.3',
    accuracy: 92.1,
    lastTrained: '2026-02-25',
    status: 'active',
    inferenceTime: '89ms',
    dataPoints: '1.8M',
    version: 'v1.4.0',
  },
  {
    id: 'engagement-v1',
    name: 'Engagement Optimizer',
    description: 'Reinforcement learning model for personalized donor notifications and gamification',
    framework: 'MindSpore 2.3',
    accuracy: 78.5,
    lastTrained: '2026-02-20',
    status: 'training',
    inferenceTime: '62ms',
    dataPoints: '560K',
    version: 'v1.2.0',
  },
];

// ── Recent Activity (Admin) ──────────────────────────────────
export const recentActivity = [
  { id: 1, type: 'donation', message: 'New donation completed at CHU Ibn Sina', time: '2 min ago', icon: 'droplet' },
  { id: 2, type: 'request', message: 'Critical blood request from CHU Hassan II (AB-)', time: '5 min ago', icon: 'alert' },
  { id: 3, type: 'match', message: 'AI matched 3 donors for REQ-2026-004', time: '8 min ago', icon: 'brain' },
  { id: 4, type: 'user', message: 'New hospital registered: Clinique Agdal, Rabat', time: '15 min ago', icon: 'building' },
  { id: 5, type: 'prediction', message: 'Shortage alert predicted for O- in Fès region', time: '22 min ago', icon: 'trending' },
  { id: 6, type: 'donation', message: '12 donations collected at Mobile Unit — Casablanca', time: '30 min ago', icon: 'droplet' },
  { id: 7, type: 'model', message: 'Engagement Optimizer model training completed', time: '1 hr ago', icon: 'brain' },
  { id: 8, type: 'user', message: '47 new donors registered today', time: '2 hr ago', icon: 'users' },
];

// ── Shortage Alerts ──────────────────────────────────────────
export const shortageAlerts = [
  { id: 1, bloodType: 'O-', region: 'Rabat-Salé-Kénitra', severity: 'critical', predictedDate: 'Mar 8', currentStock: 31, minRequired: 80, confidence: 0.91 },
  { id: 2, bloodType: 'AB-', region: 'Fès-Meknès', severity: 'critical', predictedDate: 'Mar 7', currentStock: 8, minRequired: 30, confidence: 0.94 },
  { id: 3, bloodType: 'B-', region: 'Casablanca-Settat', severity: 'high', predictedDate: 'Mar 10', currentStock: 15, minRequired: 45, confidence: 0.86 },
  { id: 4, bloodType: 'A-', region: 'Marrakech-Safi', severity: 'medium', predictedDate: 'Mar 12', currentStock: 23, minRequired: 50, confidence: 0.79 },
];
