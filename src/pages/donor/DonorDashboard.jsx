import { useState } from 'react';
import { Droplets, Heart, Trophy, Calendar, TrendingUp, Star, Zap, ArrowRight, Clock, Bell, BellRing, CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import StatCard from '../../components/common/StatCard';
import BloodTypeBadge from '../../components/common/BloodTypeBadge';
import { currentDonor, donationHistory, impactData, badges } from '../../data/mockData';

const quickActions = [
  { label: 'Find Donation Center', to: '/donor/nearby', icon: Zap, color: 'from-red-500 to-rose-600' },
  { label: 'View My Impact', to: '/donor/impact', icon: Heart, color: 'from-pink-500 to-rose-600' },
  { label: 'Rewards & Badges', to: '/donor/rewards', icon: Trophy, color: 'from-amber-500 to-orange-600' },
];

const donationServices = [
  {
    id: 'whole-blood',
    name: 'Whole Blood',
    icon: '🩸',
    cooldown: '56 days',
    frequency: '~6x / year',
    duration: '10–15 min',
    points: 200,
    description: 'Standard donation — the most needed type. Used in surgeries, emergencies, and transfusions.',
    status: 'available',
    eligible: true,
    nextEligible: currentDonor.nextEligible,
    impact: 'Saves up to 3 lives per donation',
  },
  {
    id: 'plasma',
    name: 'Plasma Donation',
    icon: '🧬',
    cooldown: '28 days',
    frequency: '~13x / year',
    duration: '45–60 min',
    points: 350,
    description: 'Plasma is essential for burn treatment, immunodeficiency therapy, and clotting disorders. Collected via apheresis — your red cells are returned to you.',
    status: 'coming-soon',
    launchDate: 'June 2026',
    impact: 'Critical for burn victims and immune disorders',
  },
  {
    id: 'platelets',
    name: 'Platelet Donation',
    icon: '🔬',
    cooldown: '7 days',
    frequency: 'Up to 24x / year',
    duration: '60–90 min',
    points: 400,
    description: 'Platelets are vital for cancer patients, organ transplants, and major surgeries. Single donation can provide 6x more platelets than whole blood extraction.',
    status: 'coming-soon',
    launchDate: 'September 2026',
    impact: 'Lifeline for cancer and transplant patients',
  },
  {
    id: 'double-red',
    name: 'Double Red Cell',
    icon: '❤️‍🔥',
    cooldown: '112 days',
    frequency: '~3x / year',
    duration: '30 min',
    points: 500,
    description: 'Collects 2 units of red cells in a single visit — ideal for universal donors (O- and O+). Red cells returned plasma and platelets to you.',
    status: 'coming-soon',
    launchDate: '2027',
    impact: 'Double the red cells, double the impact',
  },
];

export default function DonorDashboard() {
  const [notified, setNotified] = useState({});
  const earnedBadges = badges.filter((b) => b.earned);
  const daysUntilEligible = Math.max(0, Math.ceil((new Date(currentDonor.nextEligible) - new Date()) / (1000 * 60 * 60 * 24)));

  const toggleNotify = (id) => setNotified((prev) => ({ ...prev, [id]: !prev[id] }));

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
        {/* Donation Services */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles size={18} className="text-purple-500" />
                Donation Services
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">More ways to donate = more visits, more impact, more points</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {donationServices.map((service, i) => {
              const isComingSoon = service.status === 'coming-soon';
              const isNotified = notified[service.id];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={clsx(
                    'card p-4 relative overflow-hidden transition-all',
                    isComingSoon ? 'border-dashed border-2 border-gray-200' : 'hover:shadow-md'
                  )}
                >
                  {isComingSoon && (
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 uppercase tracking-wider">
                        Coming Soon
                      </span>
                    </div>
                  )}
                  {!isComingSoon && service.eligible && (
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-0.5">
                        <CheckCircle size={9} /> Available
                      </span>
                    </div>
                  )}

                  <span className="text-3xl">{service.icon}</span>
                  <h4 className="text-sm font-bold text-gray-900 mt-2">{service.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{service.description}</p>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Clock size={11} className="text-gray-400" />
                      <span>Every <span className="font-semibold text-gray-900">{service.cooldown}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <TrendingUp size={11} className="text-gray-400" />
                      <span className="font-medium text-gray-900">{service.frequency}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span><span className="font-semibold text-amber-600">{service.points}</span> pts / donation</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 mb-2">{service.impact}</p>
                    {isComingSoon ? (
                      <button
                        onClick={() => toggleNotify(service.id)}
                        className={clsx(
                          'w-full text-xs font-medium py-2 rounded-lg transition-all flex items-center justify-center gap-1.5',
                          isNotified
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        )}
                      >
                        {isNotified ? (
                          <>
                            <BellRing size={12} />
                            You'll be notified · {service.launchDate}
                          </>
                        ) : (
                          <>
                            <Bell size={12} />
                            Notify Me · {service.launchDate}
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-xs text-gray-500">
                        {service.eligible ? (
                          daysUntilEligible > 0 ? (
                            <span>Eligible in <span className="font-semibold text-red-600">{daysUntilEligible} days</span></span>
                          ) : (
                            <Link to="/donor/nearby" className="inline-flex items-center gap-1 text-red-600 font-semibold hover:text-red-700">
                              Book Now <ArrowRight size={12} />
                            </Link>
                          )
                        ) : null}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

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
