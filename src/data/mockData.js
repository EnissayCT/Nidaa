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
  { id: 7, name: 'Hôpital Militaire Mohammed V', city: 'Rabat', region: 'Rabat-Salé-Kénitra', distance: 3.5, urgentNeeds: ['O-'], bloodBank: true, rating: 4.6, waitTime: '20 min', phone: '+212 537 71 41 41' },
  { id: 8, name: 'Centre de Transfusion Sanguine Casablanca', city: 'Casablanca', region: 'Casablanca-Settat', distance: 85.2, urgentNeeds: ['A-', 'O-', 'B-'], bloodBank: true, rating: 4.8, waitTime: '8 min', phone: '+212 522 27 54 00' },
  { id: 9, name: 'Clinique Dar Salam', city: 'Casablanca', region: 'Casablanca-Settat', distance: 89.0, urgentNeeds: [], bloodBank: false, rating: 4.3, waitTime: '15 min', phone: '+212 522 86 10 10' },
  { id: 10, name: 'CHU Mohammed VI', city: 'Oujda', region: 'Oriental', distance: 475.0, urgentNeeds: ['AB-', 'O-'], bloodBank: true, rating: 4.4, waitTime: '18 min', phone: '+212 536 68 31 00' },
  { id: 11, name: 'Hôpital Moulay Youssef', city: 'Casablanca', region: 'Casablanca-Settat', distance: 86.8, urgentNeeds: ['B-'], bloodBank: true, rating: 4.2, waitTime: '22 min', phone: '+212 522 26 12 00' },
  { id: 12, name: 'CHU Mohammed VI', city: 'Tanger', region: 'Tanger-Tétouan-Al Hoceïma', distance: 280.0, urgentNeeds: ['O-', 'A-'], bloodBank: true, rating: 4.5, waitTime: '14 min', phone: '+212 539 32 50 00' },
  { id: 13, name: 'Centre Régional de Transfusion Sanguine', city: 'Casablanca', region: 'Casablanca-Settat', distance: 88.3, urgentNeeds: ['O-', 'B-', 'AB-'], bloodBank: true, rating: 4.9, waitTime: '5 min', phone: '+212 522 25 30 30' },
  { id: 14, name: 'Hôpital Hassan II', city: 'Agadir', region: 'Souss-Massa', distance: 570.0, urgentNeeds: ['A-'], bloodBank: true, rating: 4.3, waitTime: '20 min', phone: '+212 528 84 77 77' },
  { id: 15, name: 'Clinique Internationale de Marrakech', city: 'Marrakech', region: 'Marrakech-Safi', distance: 325.0, urgentNeeds: [], bloodBank: false, rating: 4.7, waitTime: '10 min', phone: '+212 524 43 49 99' },
  { id: 16, name: 'CHU Hassan II', city: 'Settat', region: 'Casablanca-Settat', distance: 60.0, urgentNeeds: ['O+', 'B-'], bloodBank: true, rating: 4.1, waitTime: '25 min', phone: '+212 523 40 10 10' },
  { id: 17, name: 'Centre de Transfusion Sanguine', city: 'Meknès', region: 'Fès-Meknès', distance: 140.0, urgentNeeds: ['AB-', 'O-'], bloodBank: true, rating: 4.5, waitTime: '10 min', phone: '+212 535 52 18 00' },
  { id: 18, name: 'Hôpital Régional de Kénitra', city: 'Kénitra', region: 'Rabat-Salé-Kénitra', distance: 40.0, urgentNeeds: ['B-', 'A-'], bloodBank: true, rating: 4.2, waitTime: '18 min', phone: '+212 537 37 10 10' },
];

// ── Blood Requests ───────────────────────────────────────────
export const bloodRequests = [
  { id: 'REQ-2026-001', hospital: 'CHU Ibn Sina', city: 'Rabat', bloodType: 'O-', units: 5, urgency: 'critical', status: 'active', createdAt: '2026-03-05T10:30:00', reason: 'Emergency Surgery', matchedDonors: 3, responseTime: '8 min' },
  { id: 'REQ-2026-002', hospital: 'CHU Ibn Rochd', city: 'Casablanca', bloodType: 'A-', units: 3, urgency: 'high', status: 'active', createdAt: '2026-03-05T14:15:00', reason: 'Scheduled Transfusion', matchedDonors: 7, responseTime: '12 min' },
  { id: 'REQ-2026-003', hospital: 'Hôpital Cheikh Zaïd', city: 'Rabat', bloodType: 'B-', units: 2, urgency: 'medium', status: 'fulfilled', createdAt: '2026-03-04T09:00:00', reason: 'Maternal Care', matchedDonors: 5, responseTime: '22 min' },
  { id: 'REQ-2026-004', hospital: 'CHU Hassan II', city: 'Fès', bloodType: 'AB-', units: 4, urgency: 'critical', status: 'active', createdAt: '2026-03-06T07:45:00', reason: 'Accident Emergency', matchedDonors: 2, responseTime: '5 min' },
  { id: 'REQ-2026-005', hospital: 'CHU Mohammed VI', city: 'Marrakech', bloodType: 'O+', units: 6, urgency: 'low', status: 'fulfilled', createdAt: '2026-03-03T11:20:00', reason: 'Routine Stock Replenishment', matchedDonors: 12, responseTime: '45 min' },
  { id: 'REQ-2026-006', hospital: 'CHU Ibn Sina', city: 'Rabat', bloodType: 'A+', units: 3, urgency: 'medium', status: 'active', createdAt: '2026-03-06T08:00:00', reason: 'Post-Operative Care', matchedDonors: 8, responseTime: '15 min' },
  { id: 'REQ-2026-007', hospital: 'Hôpital Militaire Rabat', city: 'Rabat', bloodType: 'O-', units: 8, urgency: 'critical', status: 'active', createdAt: '2026-03-06T09:30:00', reason: 'Mass Casualty Incident', matchedDonors: 4, responseTime: '6 min' },
  { id: 'REQ-2026-008', hospital: 'CHU Ibn Rochd', city: 'Casablanca', bloodType: 'B+', units: 4, urgency: 'high', status: 'active', createdAt: '2026-03-06T11:00:00', reason: 'Cancer Treatment — Leukemia', matchedDonors: 9, responseTime: '18 min' },
  { id: 'REQ-2026-009', hospital: 'CHU Hassan II', city: 'Fès', bloodType: 'A+', units: 2, urgency: 'medium', status: 'fulfilled', createdAt: '2026-03-05T08:20:00', reason: 'Kidney Transplant', matchedDonors: 6, responseTime: '14 min' },
  { id: 'REQ-2026-010', hospital: 'Clinique Agdal', city: 'Rabat', bloodType: 'O+', units: 3, urgency: 'low', status: 'fulfilled', createdAt: '2026-03-04T15:45:00', reason: 'Scheduled Surgery — Hip Replacement', matchedDonors: 11, responseTime: '32 min' },
  { id: 'REQ-2026-011', hospital: 'CHU Mohammed VI', city: 'Marrakech', bloodType: 'AB+', units: 2, urgency: 'high', status: 'active', createdAt: '2026-03-06T06:15:00', reason: 'Neonatal Transfusion', matchedDonors: 3, responseTime: '10 min' },
  { id: 'REQ-2026-012', hospital: 'Hôpital Cheikh Zaïd', city: 'Rabat', bloodType: 'A-', units: 5, urgency: 'critical', status: 'active', createdAt: '2026-03-06T12:00:00', reason: 'Cardiac Surgery', matchedDonors: 4, responseTime: '7 min' },
  { id: 'REQ-2026-013', hospital: 'Centre Transfusion Casablanca', city: 'Casablanca', bloodType: 'B-', units: 6, urgency: 'high', status: 'active', createdAt: '2026-03-06T10:30:00', reason: 'Thalassemia Patients — Monthly', matchedDonors: 5, responseTime: '20 min' },
  { id: 'REQ-2026-014', hospital: 'CHU Ibn Sina', city: 'Rabat', bloodType: 'O-', units: 3, urgency: 'medium', status: 'fulfilled', createdAt: '2026-03-03T16:00:00', reason: 'Trauma Center Stock', matchedDonors: 7, responseTime: '25 min' },
  { id: 'REQ-2026-015', hospital: 'CHU Ibn Rochd', city: 'Casablanca', bloodType: 'AB-', units: 2, urgency: 'critical', status: 'active', createdAt: '2026-03-06T13:15:00', reason: 'Liver Transplant — Urgent', matchedDonors: 1, responseTime: '4 min' },
  { id: 'REQ-2026-016', hospital: 'CHU Hassan II', city: 'Fès', bloodType: 'O+', units: 10, urgency: 'high', status: 'active', createdAt: '2026-03-06T07:00:00', reason: 'Pre-Ramadan Stock Build', matchedDonors: 15, responseTime: '35 min' },
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
  { id: 2, name: 'CHU Ibn Sina', email: 'admin@chu-ibnsina.ma', role: 'hospital', status: 'active', lastLogin: '2026-03-06T09:15:00', city: 'Rabat' },
  { id: 3, name: 'CHU Ibn Rochd', email: 'admin@chu-ibnrochd.ma', role: 'hospital', status: 'active', lastLogin: '2026-03-05T16:45:00', city: 'Casablanca' },
  { id: 4, name: 'Amine Tiyane', email: 'aminetiyane@gmail.com', role: 'donor', status: 'active', lastLogin: '2026-03-06T07:00:00', city: 'Rabat' },
  { id: 5, name: 'Fatima Zahra El Idrissi', email: 'fatima.z@email.com', role: 'donor', status: 'active', lastLogin: '2026-03-05T19:30:00', city: 'Casablanca' },
  { id: 6, name: 'CHU Hassan II', email: 'admin@chu-hassanii.ma', role: 'hospital', status: 'active', lastLogin: '2026-03-06T06:00:00', city: 'Fès' },
  { id: 7, name: 'Youssef Mansouri', email: 'youssef.m@email.com', role: 'donor', status: 'inactive', lastLogin: '2026-02-28T11:00:00', city: 'Rabat' },
  { id: 8, name: 'Centre Transfusion Rabat', email: 'admin@crts-rabat.ma', role: 'hospital', status: 'active', lastLogin: '2026-03-06T08:00:00', city: 'Rabat' },
  { id: 9, name: 'Salma Rachidi', email: 'salma.r@email.com', role: 'donor', status: 'active', lastLogin: '2026-03-06T10:20:00', city: 'Tanger' },
  { id: 10, name: 'Karim Hajji', email: 'karim.h@email.com', role: 'donor', status: 'active', lastLogin: '2026-03-05T14:10:00', city: 'Rabat' },
  { id: 11, name: 'CHU Mohammed VI', email: 'admin@chu-mohammedvi.ma', role: 'hospital', status: 'active', lastLogin: '2026-03-06T07:30:00', city: 'Marrakech' },
  { id: 12, name: 'Nadia Lahlou', email: 'nadia.l@email.com', role: 'donor', status: 'active', lastLogin: '2026-03-04T21:00:00', city: 'Casablanca' },
  { id: 13, name: 'Omar Kettani', email: 'omar.k@email.com', role: 'donor', status: 'active', lastLogin: '2026-03-06T06:45:00', city: 'Marrakech' },
  { id: 14, name: 'Hôpital Cheikh Zaïd', email: 'admin@cheikh-zaid.ma', role: 'hospital', status: 'active', lastLogin: '2026-03-06T09:00:00', city: 'Rabat' },
  { id: 15, name: 'Aicha Benali', email: 'aicha.b@email.com', role: 'donor', status: 'active', lastLogin: '2026-03-05T12:30:00', city: 'Fès' },
  { id: 16, name: 'Hassan Tazi', email: 'hassan.t@email.com', role: 'donor', status: 'inactive', lastLogin: '2026-02-20T09:00:00', city: 'Agadir' },
  { id: 17, name: 'Meryem Alaoui', email: 'meryem.a@email.com', role: 'donor', status: 'active', lastLogin: '2026-03-06T08:15:00', city: 'Oujda' },
  { id: 18, name: 'Clinique Agdal', email: 'admin@clinique-agdal.ma', role: 'hospital', status: 'active', lastLogin: '2026-03-06T07:45:00', city: 'Rabat' },
  { id: 19, name: 'Rachid Benmoussa', email: 'rachid.b@email.com', role: 'donor', status: 'active', lastLogin: '2026-03-05T18:00:00', city: 'Kénitra' },
  { id: 20, name: 'Imane Saadi', email: 'imane.s@email.com', role: 'donor', status: 'active', lastLogin: '2026-03-06T11:00:00', city: 'Meknès' },
  { id: 21, name: 'Hôpital Militaire Rabat', email: 'admin@hm-rabat.ma', role: 'hospital', status: 'active', lastLogin: '2026-03-06T06:30:00', city: 'Rabat' },
  { id: 22, name: 'Zakaria El Amrani', email: 'zakaria.e@email.com', role: 'donor', status: 'active', lastLogin: '2026-03-04T15:20:00', city: 'Casablanca' },
  { id: 23, name: 'Sanae Benhida', email: 'sanae.b@email.com', role: 'donor', status: 'active', lastLogin: '2026-03-05T11:45:00', city: 'Rabat' },
  { id: 24, name: 'Mohamed Ait Ougrour', email: 'mohamed.ao@email.com', role: 'donor', status: 'inactive', lastLogin: '2026-01-15T10:00:00', city: 'Tiznit' },
  { id: 25, name: 'Centre Transfusion Casablanca', email: 'admin@crts-casa.ma', role: 'hospital', status: 'active', lastLogin: '2026-03-06T08:45:00', city: 'Casablanca' },
  { id: 26, name: 'Houda Filali', email: 'houda.f@email.com', role: 'donor', status: 'active', lastLogin: '2026-03-06T09:30:00', city: 'Tétouan' },
  { id: 27, name: 'Dr. Youssef Berrada', email: 'youssef.b@nidaa.ma', role: 'admin', status: 'active', lastLogin: '2026-03-06T07:00:00', city: 'Casablanca' },
  { id: 28, name: 'Hajar Ouazzani', email: 'hajar.o@email.com', role: 'donor', status: 'active', lastLogin: '2026-03-03T20:15:00', city: 'Rabat' },
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

// ── Sponsors & Partners (Admin) ──────────────────────────────
export const sponsors = [
  { id: 1, name: 'Marjane Group', logo: '🛒', tier: 'gold', category: 'Retail', contactName: 'Khalid Bennani', contactEmail: 'partnerships@marjane.ma', phone: '+212 522 97 40 00', city: 'Casablanca', since: '2025-06-01', contract: '2026-12-31', rewardType: '10% discount on purchases over 200 MAD', redemptions: 203, status: 'active', monthlyBudget: 25000, totalInvested: 180000 },
  { id: 2, name: 'City Club Morocco', logo: '💪', tier: 'silver', category: 'Health & Fitness', contactName: 'Sara El Fassi', contactEmail: 'collab@cityclub.ma', phone: '+212 522 36 00 00', city: 'Casablanca', since: '2025-09-15', contract: '2026-09-15', rewardType: '20% off 3-month gym membership', redemptions: 89, status: 'active', monthlyBudget: 15000, totalInvested: 90000 },
  { id: 3, name: 'Mégarama Cinemas', logo: '🎬', tier: 'silver', category: 'Entertainment', contactName: 'Ahmed Tazi', contactEmail: 'sponsors@megarama.ma', phone: '+212 522 20 33 00', city: 'Casablanca', since: '2025-08-01', contract: '2026-08-01', rewardType: 'Free cinema ticket', redemptions: 312, status: 'active', monthlyBudget: 12000, totalInvested: 84000 },
  { id: 4, name: 'Rabat-Salé Tramway', logo: '🚋', tier: 'gold', category: 'Transport', contactName: 'Rachid Naciri', contactEmail: 'partenariat@tram-rbs.ma', phone: '+212 537 20 20 20', city: 'Rabat', since: '2025-03-01', contract: '2027-03-01', rewardType: 'Free tramway day pass', redemptions: 156, status: 'active', monthlyBudget: 18000, totalInvested: 216000 },
  { id: 5, name: 'Paul Boulangerie', logo: '☕', tier: 'bronze', category: 'Food & Dining', contactName: 'Marie Dupont', contactEmail: 'partner@paul.ma', phone: '+212 537 77 10 00', city: 'Rabat', since: '2025-11-01', contract: '2026-11-01', rewardType: 'Free coffee & pastry', redemptions: 234, status: 'active', monthlyBudget: 8000, totalInvested: 40000 },
  { id: 6, name: 'Careem Morocco', logo: '🚗', tier: 'gold', category: 'Transport', contactName: 'Lina Bousfiha', contactEmail: 'morocco@careem.com', phone: '+212 800 000 000', city: 'Casablanca', since: '2025-04-01', contract: '2026-12-31', rewardType: '15% off on next 3 rides', redemptions: 178, status: 'active', monthlyBudget: 22000, totalInvested: 264000 },
  { id: 7, name: 'Spotify', logo: '🎵', tier: 'silver', category: 'Tech', contactName: 'International Partnerships', contactEmail: 'partnerships-mena@spotify.com', phone: '', city: 'Remote', since: '2026-01-01', contract: '2026-12-31', rewardType: '1 month free Premium', redemptions: 156, status: 'active', monthlyBudget: 10000, totalInvested: 30000 },
  { id: 8, name: 'Zara Morocco', logo: '👕', tier: 'gold', category: 'Shopping', contactName: 'Fatima Amrani', contactEmail: 'csr@inditex.ma', phone: '+212 522 99 60 00', city: 'Casablanca', since: '2025-07-01', contract: '2026-06-30', rewardType: '100 MAD voucher', redemptions: 28, status: 'active', monthlyBudget: 30000, totalInvested: 270000 },
  { id: 9, name: 'Samsung Morocco', logo: '📱', tier: 'silver', category: 'Tech', contactName: 'Youssef Khalil', contactEmail: 'csr@samsung.ma', phone: '+212 522 58 00 00', city: 'Casablanca', since: '2025-10-01', contract: '2026-10-01', rewardType: '20% off accessories', redemptions: 44, status: 'active', monthlyBudget: 14000, totalInvested: 70000 },
  { id: 10, name: 'Jumia Morocco', logo: '📦', tier: 'bronze', category: 'E-Commerce', contactName: 'Hicham El Idrissi', contactEmail: 'partners@jumia.ma', phone: '+212 522 43 00 00', city: 'Casablanca', since: '2026-01-15', contract: '2026-12-31', rewardType: '50 MAD credit', redemptions: 94, status: 'active', monthlyBudget: 9000, totalInvested: 18000 },
  { id: 11, name: 'La Mamounia Spa', logo: '🧖', tier: 'platinum', category: 'Wellness', contactName: 'Naima Berrada', contactEmail: 'events@mamounia.com', phone: '+212 524 38 86 00', city: 'Marrakech', since: '2025-05-01', contract: '2026-12-31', rewardType: '1-hour spa & hammam session', redemptions: 12, status: 'active', monthlyBudget: 40000, totalInvested: 440000 },
  { id: 12, name: 'Clinique Agdal', logo: '🏥', tier: 'platinum', category: 'Health', contactName: 'Dr. Imane Saadi', contactEmail: 'direction@clinique-agdal.ma', phone: '+212 537 77 55 00', city: 'Rabat', since: '2025-01-01', contract: '2027-01-01', rewardType: 'Free blood panel + vitals check', redemptions: 47, status: 'active', monthlyBudget: 35000, totalInvested: 490000 },
  { id: 13, name: 'Royal Air Maroc', logo: '✈️', tier: 'platinum', category: 'Travel', contactName: 'Amina Belhaj', contactEmail: 'partnerships@royalairmaroc.com', phone: '+212 522 48 97 97', city: 'Casablanca', since: '2025-02-01', contract: '2027-02-01', rewardType: '500 Safar Flyer miles per donation', redemptions: 78, status: 'active', monthlyBudget: 50000, totalInvested: 650000 },
  { id: 14, name: 'Decathlon Morocco', logo: '🏊', tier: 'silver', category: 'Sports', contactName: 'Adil Motassim', contactEmail: 'csr@decathlon.ma', phone: '+212 522 87 50 00', city: 'Casablanca', since: '2025-11-01', contract: '2026-11-01', rewardType: '15% off on purchases over 300 MAD', redemptions: 63, status: 'active', monthlyBudget: 11000, totalInvested: 55000 },
  { id: 15, name: 'ONCF (Train)', logo: '🚆', tier: 'gold', category: 'Transport', contactName: 'Samir Bennani', contactEmail: 'partenariats@oncf.ma', phone: '+212 537 77 47 47', city: 'Rabat', since: '2025-06-01', contract: '2026-12-31', rewardType: '30% off 1st class Al Boraq ticket', redemptions: 112, status: 'active', monthlyBudget: 20000, totalInvested: 200000 },
  { id: 16, name: 'McDonald\'s Morocco', logo: '🍔', tier: 'bronze', category: 'Food & Dining', contactName: 'Hind Lahmidi', contactEmail: 'marketing@mcdonalds.ma', phone: '+212 522 25 00 00', city: 'Casablanca', since: '2026-01-01', contract: '2026-12-31', rewardType: 'Free Big Mac meal', redemptions: 287, status: 'active', monthlyBudget: 7000, totalInvested: 21000 },
  { id: 17, name: 'Inwi', logo: '📶', tier: 'gold', category: 'Telecom', contactName: 'Reda Chraibi', contactEmail: 'sponsoring@inwi.ma', phone: '+212 529 00 00 00', city: 'Casablanca', since: '2025-09-01', contract: '2026-09-01', rewardType: '5 GB free data for 30 days', redemptions: 198, status: 'active', monthlyBudget: 16000, totalInvested: 96000 },
  { id: 18, name: 'Virgin Megastore Morocco', logo: '🎧', tier: 'bronze', category: 'Entertainment', contactName: 'Leila Fassi', contactEmail: 'events@virginmegastore.ma', phone: '+212 522 77 11 00', city: 'Casablanca', since: '2026-02-01', contract: '2026-12-31', rewardType: '50 MAD gift card', redemptions: 31, status: 'active', monthlyBudget: 6000, totalInvested: 6000 },
];
