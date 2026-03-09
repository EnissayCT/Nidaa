import { Droplets, AlertTriangle, Clock, TrendingUp, Activity, Brain, Users } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import BloodStockChart from '../../components/charts/BloodStockChart';
import PredictionChart from '../../components/charts/PredictionChart';
import { bloodStock, bloodRequests, shortageAlerts } from '../../data/mockData';
import BloodTypeBadge from '../../components/common/BloodTypeBadge';

export default function HospitalDashboard() {
  const activeRequests = bloodRequests.filter((r) => r.status === 'active');
  const criticalTypes = bloodStock.filter((s) => s.units / s.capacity < 0.25);
  const totalUnits = bloodStock.reduce((sum, s) => sum + s.units, 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Blood Units" value={totalUnits} change="+24 today" trend="up" icon={Droplets} color="red" />
        <StatCard label="Active Requests" value={activeRequests.length} change="2 critical" trend="up" icon={AlertTriangle} color="amber" />
        <StatCard label="Critical Types" value={criticalTypes.length} change="Needs attention" trend="down" icon={Activity} color="red" />
        <StatCard label="AI Predictions" value="3 Alerts" change="Next 48h" trend="stable" icon={Brain} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Blood Stock Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Blood Stock Levels</h3>
              <p className="text-sm text-gray-500">Current inventory by blood type</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Good</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Low</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical</span>
            </div>
          </div>
          <BloodStockChart height={260} />
        </div>

        {/* Demand Prediction */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">AI Demand Forecast</h3>
              <p className="text-sm text-gray-500">14-day prediction with confidence bands</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium">
              <Brain size={12} />
              MindSpore
            </div>
          </div>
          <PredictionChart height={260} />
          <div className="flex items-center gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 rounded-full" /> Predicted</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 rounded-full" /> Actual</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-100 rounded" /> Confidence</span>
          </div>
        </div>
      </div>

      {/* Active Requests & Shortage Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Blood Requests */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Active Blood Requests</h3>
            <span className="text-xs text-gray-500">{activeRequests.length} active</span>
          </div>
          <div className="space-y-3">
            {activeRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <BloodTypeBadge type={req.bloodType} urgency={req.urgency} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{req.hospital}</p>
                    <p className="text-xs text-gray-500">{req.reason} · {req.units} units</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-900">{req.matchedDonors} matched</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                    <Clock size={10} /> {req.responseTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shortage Alerts */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-500" />
            <h3 className="font-semibold text-gray-900">AI Shortage Predictions</h3>
          </div>
          <div className="space-y-3">
            {shortageAlerts.map((alert) => (
              <div key={alert.id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BloodTypeBadge type={alert.bloodType} urgency={alert.severity} />
                    <span className="text-sm font-medium text-gray-900">{alert.region}</span>
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(alert.confidence * 100)}% confidence</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-500"
                    style={{ width: `${(alert.currentStock / alert.minRequired) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{alert.currentStock} units in stock</span>
                  <span>{alert.minRequired} min. required</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
