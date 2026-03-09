import { Droplets, Heart, Trophy, Calendar, TrendingUp, Star, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import BloodTypeBadge from '../../components/common/BloodTypeBadge';
import { currentDonor, donationHistory, impactData, badges } from '../../data/mockData';

const quickActions = [
  { label: 'Find Donation Center', to: '/donor/nearby', icon: Zap, color: 'from-red-500 to-rose-600' },
  { label: 'View My Impact', to: '/donor/impact', icon: Heart, color: 'from-pink-500 to-rose-600' },
  { label: 'Rewards & Badges', to: '/donor/rewards', icon: Trophy, color: 'from-amber-500 to-orange-600' },
];

export default function DonorDashboard() {
  const earnedBadges = badges.filter((b) => b.earned);
  const daysUntilEligible = Math.max(0, Math.ceil((new Date(currentDonor.nextEligible) - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="card p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-2xl font-black shadow-lg">
              {currentDonor.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{currentDonor.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <BloodTypeBadge type={currentDonor.bloodType} size="sm" />
                <span className="text-sm text-gray-400">Member since {currentDonor.memberSince}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{currentDonor.points}</p>
              <p className="text-xs text-gray-400">Points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{currentDonor.level}</p>
              <p className="text-xs text-gray-400">Level</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">#{currentDonor.rank}</p>
              <p className="text-xs text-gray-400">Rank</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Donations" value={currentDonor.totalDonations} change={`${currentDonor.streak} streak`} trend="up" icon={Droplets} color="red" />
        <StatCard label="Lives Helped" value={impactData.livesHelped} change="+1 this month" trend="up" icon={Heart} color="green" />
        <StatCard label="Total Volume" value={currentDonor.totalVolume} change="Whole Blood + Platelets" trend="up" icon={TrendingUp} color="blue" />
        <StatCard label="Next Eligible" value={`${daysUntilEligible} days`} change={currentDonor.nextEligible} trend="stable" icon={Calendar} color="amber" />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="card-hover p-5 group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                <action.icon size={18} className="text-white" />
              </div>
              <span className="font-medium text-gray-900">{action.label}</span>
            </div>
            <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Donations</h3>
            <Link to="/donor/history" className="text-sm text-red-600 font-medium hover:text-red-700">View All</Link>
          </div>
          <div className="space-y-3">
            {donationHistory.slice(0, 4).map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                    <Droplets size={16} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{d.type} · {d.volume}</p>
                    <p className="text-xs text-gray-500">{d.location.split(',')[0]}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-900">{new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-xs text-amber-600">+{d.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Badges */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">My Badges</h3>
            <Link to="/donor/rewards" className="text-sm text-red-600 font-medium hover:text-red-700">View All</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {earnedBadges.slice(0, 6).map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{badge.name}</p>
                  <p className="text-xs text-gray-500">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
