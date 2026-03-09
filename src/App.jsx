import { Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAI from './pages/admin/AdminAI';
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import HospitalRequests from './pages/hospital/HospitalRequests';
import HospitalStock from './pages/hospital/HospitalStock';
import HospitalPredictions from './pages/hospital/HospitalPredictions';
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorHistory from './pages/donor/DonorHistory';
import DonorImpact from './pages/donor/DonorImpact';
import DonorNearby from './pages/donor/DonorNearby';
import DonorRewards from './pages/donor/DonorRewards';
import DashboardLayout from './components/layout/DashboardLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<DashboardLayout role="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="ai" element={<AdminAI />} />
      </Route>

      <Route path="/hospital" element={<DashboardLayout role="hospital" />}>
        <Route index element={<HospitalDashboard />} />
        <Route path="requests" element={<HospitalRequests />} />
        <Route path="stock" element={<HospitalStock />} />
        <Route path="predictions" element={<HospitalPredictions />} />
      </Route>

      <Route path="/donor" element={<DashboardLayout role="donor" />}>
        <Route index element={<DonorDashboard />} />
        <Route path="history" element={<DonorHistory />} />
        <Route path="impact" element={<DonorImpact />} />
        <Route path="nearby" element={<DonorNearby />} />
        <Route path="rewards" element={<DonorRewards />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
