import { Users, Building2, Droplets, Brain, TrendingUp, Activity, AlertTriangle, Clock } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import DonationTrendsChart from '../../components/charts/DonationTrendsChart';
import { platformStats, recentActivity, shortageAlerts } from '../../data/mockData';

const iconMap = {
  droplet: Droplets, alert: AlertTriangle, brain: Brain,
  building: Building2, trending: TrendingUp, users: Users,
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Donors" value={platformStats.totalDonors.toLocaleString()} change="+324 this month" trend="up" icon={Users} color="red" />
        <StatCard label="Active Hospitals" value={platformStats.totalHospitals} change="+3 new" trend="up" icon={Building2} color="blue" />
        <StatCard label="Donations Today" value={platformStats.donationsToday} change="+12% vs avg" trend="up" icon={Droplets} color="green" />
        <StatCard label="AI Model Accuracy" value={`${platformStats.aiModelAccuracy}%`} change="+1.2% last week" trend="up" icon={Brain} color="purple" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Donation Trends Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Platform Activity</h3>
              <p className="text-sm text-gray-500">Donations vs Requests — Last 30 days</p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium">
              <Activity size={12} />
              Live
            </div>
          </div>
          <DonationTrendsChart height={280} />
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.slice(0, 6).map((item) => {
              const Icon = iconMap[item.icon] || Activity;
              return (
                <div key={item.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">{item.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Shortage Alerts + Quick Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-500" />
            <h3 className="font-semibold text-gray-900">AI Shortage Alerts</h3>
          </div>
          <div className="space-y-3">
            {shortageAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {alert.bloodType}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.region}</p>
                    <p className="text-xs text-gray-500">Predicted: {alert.predictedDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{alert.currentStock}/{alert.minRequired}</p>
                  <p className="text-xs text-gray-500">{Math.round(alert.confidence * 100)}% confidence</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Platform Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Match Success Rate', value: `${platformStats.matchSuccessRate}%`, icon: Brain },
              { label: 'Avg Response Time', value: platformStats.avgResponseTime, icon: Clock },
              { label: 'Active Donors', value: platformStats.activeDonors.toLocaleString(), icon: Users },
              { label: 'Blood Banks', value: platformStats.bloodBanks, icon: Building2 },
              { label: 'Monthly Donations', value: platformStats.donationsThisMonth.toLocaleString(), icon: Droplets },
              { label: 'Platform Uptime', value: `${platformStats.platformUptime}%`, icon: Activity },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <item.icon size={16} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
