import { Trophy, Star, Medal, Crown, TrendingUp, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { badges, leaderboard, currentDonor } from '../../data/mockData';

const levelThresholds = [
  { level: 'Bronze', min: 0, max: 500, color: 'from-amber-600 to-amber-700' },
  { level: 'Silver', min: 500, max: 1500, color: 'from-gray-400 to-gray-500' },
  { level: 'Gold', min: 1500, max: 3000, color: 'from-amber-400 to-amber-500' },
  { level: 'Platinum', min: 3000, max: 5000, color: 'from-indigo-400 to-purple-500' },
  { level: 'Diamond', min: 5000, max: 10000, color: 'from-cyan-400 to-blue-500' },
];

const rewards = [
  { name: 'Free Health Checkup', points: 500, provider: 'Partner Clinics', available: true },
  { name: 'Museum Pass', points: 800, provider: 'Cultural Partnership', available: true },
  { name: 'Sports Event Ticket', points: 1200, provider: 'Stadium Partners', available: true },
  { name: 'Wellness Retreat Discount', points: 2000, provider: 'Health Partners', available: false },
];

export default function DonorRewards() {
  const currentLevel = levelThresholds.find((l) => currentDonor.points >= l.min && currentDonor.points < l.max) || levelThresholds[levelThresholds.length - 1];
  const nextLevel = levelThresholds[levelThresholds.indexOf(currentLevel) + 1];
  const progressToNext = nextLevel ? ((currentDonor.points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Points & Level Card */}
      <div className="card p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-amber-400" />
              <span className="text-sm text-gray-400">Your Rewards</span>
            </div>
            <p className="text-4xl font-black mt-2 text-amber-400">{currentDonor.points.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-1">points earned</p>
          </div>
          <div className="text-left sm:text-right">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${currentLevel.color} text-white text-sm font-bold`}>
              <Crown size={14} />
              {currentLevel.level} Donor
            </div>
            {nextLevel && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Progress to {nextLevel.level}</span>
                  <span>{Math.round(progressToNext)}%</span>
                </div>
                <div className="w-48 bg-white/10 rounded-full h-2">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${nextLevel.color} transition-all`}
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{nextLevel.min - currentDonor.points} points to go</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Badges */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Badge Collection
            <span className="text-sm font-normal text-gray-500 ml-2">
              {badges.filter((b) => b.earned).length}/{badges.length}
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={clsx(
                  'p-3 rounded-xl border transition-all',
                  badge.earned
                    ? 'bg-white border-gray-100 hover:shadow-md'
                    : 'bg-gray-50 border-gray-100 opacity-60'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{badge.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{badge.name}</p>
                    <p className="text-xs text-gray-500 truncate">{badge.description}</p>
                  </div>
                </div>
                {!badge.earned && badge.progress !== undefined && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="h-full rounded-full bg-red-500" style={{ width: `${badge.progress}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{badge.progress}%</p>
                  </div>
                )}
                {badge.earned && (
                  <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                    <Star size={10} className="fill-current" />
                    Earned {new Date(badge.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Medal size={18} className="text-amber-500" />
            National Leaderboard
          </h3>
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={clsx(
                  'flex items-center justify-between p-3 rounded-xl transition-colors',
                  entry.isCurrentUser ? 'bg-red-50 border border-red-200' : 'bg-gray-50 hover:bg-gray-100'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                    entry.rank === 1 ? 'bg-amber-400 text-white' :
                    entry.rank === 2 ? 'bg-gray-300 text-white' :
                    entry.rank === 3 ? 'bg-amber-600 text-white' :
                    'bg-gray-100 text-gray-600'
                  )}>
                    {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                  </span>
                  <div>
                    <p className={clsx('text-sm font-medium', entry.isCurrentUser ? 'text-red-700' : 'text-gray-900')}>
                      {entry.name} {entry.isCurrentUser && <span className="text-xs">(You)</span>}
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
      </div>

      {/* Rewards Marketplace */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift size={18} className="text-red-500" />
          <h3 className="font-semibold text-gray-900">Rewards Marketplace</h3>
          <span className="text-xs text-gray-400">(Non-monetary, ethical rewards)</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {rewards.map((reward) => (
            <div key={reward.name} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
              <h4 className="text-sm font-semibold text-gray-900">{reward.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{reward.provider}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-bold text-amber-600">{reward.points} pts</span>
                <button
                  disabled={currentDonor.points < reward.points}
                  className={clsx(
                    'text-xs font-medium px-2.5 py-1 rounded-lg transition-colors',
                    currentDonor.points >= reward.points
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  )}
                >
                  {currentDonor.points >= reward.points ? 'Redeem' : 'Locked'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
