import { useState } from 'react';
import { Trophy, Star, Medal, Crown, Gift, Flame, Target, Zap, Tag, CheckCircle, Clock, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { badges, leaderboard, currentDonor } from '../../data/mockData';

const levelThresholds = [
  { level: 'Bronze', min: 0, max: 500, color: 'from-amber-600 to-amber-700', icon: '🥉', perks: ['Donor certificate', 'Profile badge'] },
  { level: 'Silver', min: 500, max: 1500, color: 'from-gray-400 to-gray-500', icon: '🥈', perks: ['Free health checkups', 'Priority scheduling'] },
  { level: 'Gold', min: 1500, max: 3000, color: 'from-amber-400 to-amber-500', icon: '🥇', perks: ['Partner discounts', 'VIP lounge access', 'Annual recognition'] },
  { level: 'Platinum', min: 3000, max: 5000, color: 'from-indigo-400 to-purple-500', icon: '💎', perks: ['Premium rewards', 'Event invitations', 'Ambassador status'] },
  { level: 'Diamond', min: 5000, max: 10000, color: 'from-cyan-400 to-blue-500', icon: '👑', perks: ['All perks', 'National recognition', 'Lifetime membership'] },
];

const rewardCategories = [
  { id: 'all', label: 'All Rewards' },
  { id: 'health', label: '🏥 Health' },
  { id: 'food', label: '🍽️ Food & Dining' },
  { id: 'transport', label: '🚗 Transport' },
  { id: 'shopping', label: '🛍️ Shopping' },
  { id: 'culture', label: '🎭 Culture' },
  { id: 'tech', label: '💻 Tech' },
];

const rewards = [
  { id: 1, name: 'Free Health Checkup', points: 300, provider: 'Clinique Agdal', logo: '🏥', category: 'health', description: 'Complete blood panel + vitals check', available: true, claimed: 47, expiry: '2026-06-30' },
  { id: 2, name: '20% Off Gym Membership', points: 400, provider: 'City Club Morocco', logo: '💪', category: 'health', description: '3-month gym membership discount', available: true, claimed: 89, expiry: '2026-05-31' },
  { id: 3, name: 'Free Coffee & Pastry', points: 150, provider: 'Paul Boulangerie', logo: '☕', category: 'food', description: 'Any hot drink + pastry of your choice', available: true, claimed: 234, expiry: '2026-12-31' },
  { id: 4, name: 'Restaurant Voucher 50 MAD', points: 500, provider: "La Sqala Café", logo: '🍽️', category: 'food', description: '50 MAD off at La Sqala, Casablanca', available: true, claimed: 62, expiry: '2026-08-31' },
  { id: 5, name: 'Free Tramway Day Pass', points: 200, provider: 'Rabat-Salé Tramway', logo: '🚋', category: 'transport', description: 'Unlimited rides for one day', available: true, claimed: 156, expiry: '2026-12-31' },
  { id: 6, name: '15% Off Careem Ride', points: 250, provider: 'Careem', logo: '🚗', category: 'transport', description: 'Discount on next 3 rides', available: true, claimed: 178, expiry: '2026-09-30' },
  { id: 7, name: 'Museum Pass — 2 Entries', points: 350, provider: 'Mohammed VI Museum', logo: '🎨', category: 'culture', description: 'Free entry for you + 1 guest', available: true, claimed: 41, expiry: '2026-07-31' },
  { id: 8, name: 'Cinema Ticket', points: 300, provider: 'Mégarama', logo: '🎬', category: 'culture', description: 'Any movie, any showtime', available: true, claimed: 312, expiry: '2026-12-31' },
  { id: 9, name: '10% Off at Marjane', points: 400, provider: 'Marjane', logo: '🛒', category: 'shopping', description: 'Valid on purchases over 200 MAD', available: true, claimed: 203, expiry: '2026-06-30' },
  { id: 10, name: 'Zara 100 MAD Voucher', points: 800, provider: 'Zara Morocco', logo: '👕', category: 'shopping', description: '100 MAD off on any purchase', available: true, claimed: 28, expiry: '2026-04-30' },
  { id: 11, name: 'Jumia 50 MAD Credit', points: 450, provider: 'Jumia Morocco', logo: '📦', category: 'tech', description: '50 MAD credit on next order', available: true, claimed: 94, expiry: '2026-08-31' },
  { id: 12, name: 'Spotify 1 Month Free', points: 600, provider: 'Spotify', logo: '🎵', category: 'tech', description: 'Premium subscription for 1 month', available: true, claimed: 156, expiry: '2026-12-31' },
  { id: 13, name: 'Sports Event Ticket', points: 700, provider: 'Botola Pro', logo: '⚽', category: 'culture', description: 'Ticket to a Botola Pro league match', available: true, claimed: 67, expiry: '2026-05-31' },
  { id: 14, name: 'Dental Checkup', points: 500, provider: 'Cabinet Dentaire Agdal', logo: '🦷', category: 'health', description: 'Free dental cleaning & checkup', available: true, claimed: 35, expiry: '2026-07-31' },
  { id: 15, name: 'Wellness Spa Session', points: 1000, provider: 'La Mamounia Spa', logo: '🧖', category: 'health', description: '1-hour spa & hammam session', available: true, claimed: 12, expiry: '2026-06-30' },
  { id: 16, name: 'Samsung Accessories 20% Off', points: 650, provider: 'Samsung Morocco', logo: '📱', category: 'tech', description: '20% off any accessory', available: true, claimed: 44, expiry: '2026-09-30' },
];

const dailyChallenges = [
  { id: 1, title: 'Share awareness post', points: 50, icon: '📢', completed: true },
  { id: 2, title: 'Check your eligibility', points: 30, icon: '✅', completed: true },
  { id: 3, title: 'Invite a friend to NIDAA', points: 100, icon: '👥', completed: false },
];

const weeklyChallenges = [
  { id: 1, title: 'Donate blood this week', points: 250, icon: '🩸', progress: 0, target: 1 },
  { id: 2, title: 'Refer 3 new donors', points: 300, icon: '🤝', progress: 1, target: 3 },
  { id: 3, title: 'Complete health quiz', points: 75, icon: '🧠', progress: 0, target: 1 },
];

const streakRewards = [
  { days: 2, label: '2 donations', bonus: 50, reached: true },
  { days: 5, label: '5 donations', bonus: 150, reached: true },
  { days: 10, label: '10 donations', bonus: 400, reached: true },
  { days: 15, label: '15 donations', bonus: 750, reached: false },
  { days: 20, label: '20 donations', bonus: 1200, reached: false },
  { days: 25, label: '25 donations', bonus: 2000, reached: false },
];

const redeemHistory = [
  { id: 1, reward: 'Free Coffee & Pastry', provider: 'Paul Boulangerie', points: 150, date: '2026-02-20', status: 'used' },
  { id: 2, reward: 'Free Tramway Day Pass', provider: 'Rabat-Salé Tramway', points: 200, date: '2026-01-15', status: 'used' },
  { id: 3, reward: 'Cinema Ticket', provider: 'Mégarama', points: 300, date: '2025-12-08', status: 'used' },
];

export default function DonorRewards() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('marketplace');

  const currentLevel = levelThresholds.find((l) => currentDonor.points >= l.min && currentDonor.points < l.max) || levelThresholds[levelThresholds.length - 1];
  const nextLevel = levelThresholds[levelThresholds.indexOf(currentLevel) + 1];
  const progressToNext = nextLevel ? ((currentDonor.points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  const filteredRewards = activeCategory === 'all' ? rewards : rewards.filter((r) => r.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Hero: Points, Level & Streak */}
      <div className="card overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Points */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={20} className="text-amber-400" />
                <span className="text-sm text-gray-400">Your Rewards Balance</span>
              </div>
              <p className="text-5xl font-black text-amber-400">{currentDonor.points.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-0.5">points available to redeem</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Flame size={14} className="text-orange-400" />
                  <span><span className="text-white font-semibold">{currentDonor.streak}</span> donation streak</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span><span className="text-white font-semibold">{currentDonor.totalDonations}</span> total donations</span>
                </div>
              </div>
            </div>

            {/* Level + Progress */}
            <div className="w-full md:w-auto">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${currentLevel.color} text-white text-sm font-bold shadow-lg`}>
                <Crown size={16} />
                {currentLevel.level} Donor
              </div>
              {nextLevel && (
                <div className="mt-4 md:w-64">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                    <span>Next: {nextLevel.icon} {nextLevel.level}</span>
                    <span className="text-white font-medium">{Math.round(progressToNext)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNext}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${nextLevel.color}`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{nextLevel.min - currentDonor.points} points to {nextLevel.level}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Level Perks Bar */}
        <div className="px-6 py-3 bg-gray-50 border-t flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-gray-500 shrink-0">Your perks:</span>
          {currentLevel.perks.map((perk) => (
            <span key={perk} className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 whitespace-nowrap">
              {perk}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Rewards Redeemed', value: redeemHistory.length, icon: Gift, color: 'text-red-500' },
          { label: 'Badges Earned', value: `${badges.filter((b) => b.earned).length}/${badges.length}`, icon: Medal, color: 'text-amber-500' },
          { label: 'National Rank', value: `#${currentDonor.rank}`, icon: TrendingUp, color: 'text-blue-500' },
          { label: 'Points This Month', value: '+450', icon: Zap, color: 'text-emerald-500' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Challenges & Streak */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Daily Challenges */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-blue-500" />
            <h3 className="font-semibold text-gray-900">Daily Challenges</h3>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
              {dailyChallenges.filter((c) => c.completed).length}/{dailyChallenges.length}
            </span>
          </div>
          <div className="space-y-2">
            {dailyChallenges.map((challenge) => (
              <div key={challenge.id} className={clsx('flex items-center gap-3 p-3 rounded-xl', challenge.completed ? 'bg-emerald-50' : 'bg-gray-50')}>
                <span className="text-lg">{challenge.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={clsx('text-sm font-medium', challenge.completed ? 'text-emerald-700 line-through' : 'text-gray-900')}>{challenge.title}</p>
                  <p className="text-xs text-amber-600 font-medium">+{challenge.points} pts</p>
                </div>
                {challenge.completed ? (
                  <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Challenges */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-purple-500" />
            <h3 className="font-semibold text-gray-900">Weekly Challenges</h3>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">
              <Clock size={10} className="inline-block mr-0.5" /> 4d left
            </span>
          </div>
          <div className="space-y-3">
            {weeklyChallenges.map((challenge) => {
              const pct = Math.round((challenge.progress / challenge.target) * 100);
              return (
                <div key={challenge.id} className="p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{challenge.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{challenge.title}</p>
                      <p className="text-xs text-amber-600 font-medium">+{challenge.points} pts</p>
                    </div>
                    <span className="text-xs text-gray-500">{challenge.progress}/{challenge.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="h-full rounded-full bg-purple-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donation Streak Milestones */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={18} className="text-orange-500" />
            <h3 className="font-semibold text-gray-900">Streak Milestones</h3>
          </div>
          <div className="space-y-2">
            {streakRewards.map((milestone) => (
              <div key={milestone.days} className={clsx(
                'flex items-center gap-3 p-2.5 rounded-xl',
                milestone.reached ? 'bg-orange-50' : 'bg-gray-50'
              )}>
                <div className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                  milestone.reached ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                )}>
                  {milestone.days}
                </div>
                <div className="flex-1">
                  <p className={clsx('text-sm font-medium', milestone.reached ? 'text-orange-700' : 'text-gray-600')}>{milestone.label}</p>
                  <p className="text-xs text-amber-600">+{milestone.bonus} bonus pts</p>
                </div>
                {milestone.reached && <CheckCircle size={16} className="text-orange-500" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100 w-fit">
        {[
          { id: 'marketplace', label: 'Rewards Marketplace', icon: Gift },
          { id: 'badges', label: 'Badge Collection', icon: Medal },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          { id: 'history', label: 'Redeem History', icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <tab.icon size={15} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Marketplace Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'marketplace' && (
          <motion.div key="marketplace" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {rewardCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                    activeCategory === cat.id ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Reward Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredRewards.map((reward, i) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="card p-4 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl">{reward.logo}</span>
                    <span className="text-xs text-gray-400">{reward.claimed} claimed</span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">{reward.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{reward.provider}</p>
                  <p className="text-xs text-gray-400 mt-1">{reward.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <div>
                      <span className="text-sm font-bold text-amber-600">{reward.points}</span>
                      <span className="text-xs text-gray-400 ml-0.5">pts</span>
                    </div>
                    <button
                      disabled={currentDonor.points < reward.points}
                      className={clsx(
                        'text-xs font-medium px-3 py-1.5 rounded-lg transition-colors',
                        currentDonor.points >= reward.points
                          ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      )}
                    >
                      {currentDonor.points >= reward.points ? 'Redeem' : `Need ${reward.points - currentDonor.points} more`}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-gray-50 flex items-center gap-2 text-xs text-gray-500">
              <Tag size={14} />
              <span>All rewards are non-monetary, provided by our sponsor partners. Rewards refresh monthly.</span>
            </div>
          </motion.div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <motion.div key="badges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {badges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className={clsx(
                    'p-4 rounded-xl border text-center transition-all',
                    badge.earned ? 'bg-white border-gray-100 hover:shadow-md' : 'bg-gray-50 border-gray-100 opacity-50'
                  )}
                >
                  <span className="text-4xl block mb-2">{badge.icon}</span>
                  <p className="text-sm font-semibold text-gray-900">{badge.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{badge.description}</p>
                  {!badge.earned && badge.progress !== undefined && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="h-full rounded-full bg-red-500 transition-all" style={{ width: `${badge.progress}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{badge.progress}% complete</p>
                    </div>
                  )}
                  {badge.earned && (
                    <p className="text-xs text-emerald-600 mt-2 flex items-center justify-center gap-1">
                      <Star size={10} className="fill-current" />
                      {new Date(badge.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <motion.div key="leaderboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="card overflow-hidden">
              {/* Top 3 */}
              <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="flex items-end justify-center gap-4">
                  {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, idx) => {
                    const heights = ['h-20', 'h-28', 'h-16'];
                    const sizes = ['text-3xl', 'text-4xl', 'text-3xl'];
                    return (
                      <div key={entry.rank} className="text-center">
                        <p className={`${sizes[idx]} mb-2`}>{['🥈', '🥇', '🥉'][idx]}</p>
                        <div className={`${heights[idx]} w-20 rounded-t-xl bg-gradient-to-t from-white/10 to-white/5 flex flex-col items-center justify-end pb-2`}>
                          <p className="text-white text-xs font-bold">{entry.name}</p>
                          <p className="text-amber-400 text-xs font-semibold">{entry.points.toLocaleString()} pts</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Rest */}
              <div className="p-4 space-y-1.5">
                {leaderboard.slice(3).map((entry) => (
                  <div
                    key={entry.rank}
                    className={clsx(
                      'flex items-center justify-between p-3 rounded-xl transition-colors',
                      entry.isCurrentUser ? 'bg-red-50 border border-red-200' : 'bg-gray-50 hover:bg-gray-100'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                        #{entry.rank}
                      </span>
                      <div>
                        <p className={clsx('text-sm font-medium', entry.isCurrentUser ? 'text-red-700' : 'text-gray-900')}>
                          {entry.name} {entry.isCurrentUser && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full ml-1">You</span>}
                        </p>
                        <p className="text-xs text-gray-500">{entry.city} · {entry.donations} donations</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{entry.points.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{entry.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Redeem History Tab */}
        {activeTab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="card overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Redemption History</h3>
                <span className="text-xs text-gray-500">{redeemHistory.length} redemptions</span>
              </div>
              <div className="divide-y">
                {redeemHistory.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.reward}</p>
                      <p className="text-xs text-gray-500">{item.provider} · {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-amber-600">-{item.points} pts</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium capitalize">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Roadmap */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={18} className="text-purple-500" />
          <h3 className="font-semibold text-gray-900">Level Roadmap</h3>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {levelThresholds.map((level, idx) => {
            const isActive = currentLevel.level === level.level;
            const isPast = currentDonor.points >= level.max;
            return (
              <div key={level.level} className="flex-1 min-w-[120px]">
                <div className="flex items-center">
                  <div className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0 border-2',
                    isActive ? 'border-amber-400 bg-amber-50 scale-110' : isPast ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-gray-50'
                  )}>
                    {isPast ? '✓' : level.icon}
                  </div>
                  {idx < levelThresholds.length - 1 && (
                    <div className={clsx('flex-1 h-1 rounded-full mx-1', isPast ? 'bg-emerald-400' : 'bg-gray-200')} />
                  )}
                </div>
                <p className={clsx('text-xs font-semibold mt-2', isActive ? 'text-amber-600' : isPast ? 'text-emerald-600' : 'text-gray-400')}>
                  {level.level}
                </p>
                <p className="text-[10px] text-gray-400">{level.min.toLocaleString()} pts</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
