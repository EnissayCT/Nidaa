import { useState } from 'react';
import { Building2, Gift, TrendingUp, Users, Search, Filter, ExternalLink, Mail, Phone, MapPin, Calendar, ChevronDown, Star, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { sponsors } from '../../data/mockData';

const tierConfig = {
  platinum: { label: 'Platinum', color: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  gold: { label: 'Gold', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  silver: { label: 'Silver', color: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
  bronze: { label: 'Bronze', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
};

const tierOrder = ['platinum', 'gold', 'silver', 'bronze'];

export default function AdminSponsors() {
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = sponsors
    .filter((s) => filterTier === 'all' || s.tier === filterTier)
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier));

  const totalInvestment = sponsors.reduce((sum, s) => sum + s.totalInvested, 0);
  const totalRedemptions = sponsors.reduce((sum, s) => sum + s.redemptions, 0);
  const monthlyBudget = sponsors.reduce((sum, s) => sum + s.monthlyBudget, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sponsors & Partners</h1>
        <p className="text-sm text-gray-500 mt-1">Manage corporate partnerships that provide rewards and discounts to donors</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Partners', value: sponsors.filter((s) => s.status === 'active').length, icon: Building2, color: 'text-blue-600 bg-blue-50', sub: `in ${new Set(sponsors.map((s) => s.category)).size} categories` },
          { label: 'Total Redemptions', value: totalRedemptions.toLocaleString(), icon: Gift, color: 'text-red-600 bg-red-50', sub: 'rewards claimed by donors' },
          { label: 'Monthly Sponsor Budget', value: `${(monthlyBudget / 1000).toFixed(0)}K MAD`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50', sub: 'combined monthly value' },
          { label: 'Total Investment', value: `${(totalInvestment / 1000000).toFixed(2)}M MAD`, icon: Star, color: 'text-amber-600 bg-amber-50', sub: 'since platform launch' },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.color}`}>
                <kpi.icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500">{kpi.label}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Tier Distribution */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Partnership Tiers</h3>
        <div className="flex gap-3">
          {tierOrder.map((tier) => {
            const count = sponsors.filter((s) => s.tier === tier).length;
            const config = tierConfig[tier];
            return (
              <div key={tier} className="flex-1 p-3 rounded-xl bg-gray-50 text-center">
                <div className={`w-3 h-3 rounded-full ${config.dot} mx-auto mb-2`} />
                <p className="text-lg font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-500">{config.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search partners by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', ...tierOrder].map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={clsx(
                'px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize',
                filterTier === tier ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {tier === 'all' ? 'All' : tierConfig[tier].label}
            </button>
          ))}
        </div>
      </div>

      {/* Partners List */}
      <div className="space-y-3">
        {sorted.map((sponsor, i) => {
          const config = tierConfig[sponsor.tier];
          const isExpanded = expandedId === sponsor.id;
          const contractEnd = new Date(sponsor.contract);
          const daysLeft = Math.ceil((contractEnd - new Date()) / (1000 * 60 * 60 * 24));

          return (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="card overflow-hidden"
            >
              {/* Main Row */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : sponsor.id)}
                className="w-full p-5 flex items-center gap-4 text-left hover:bg-gray-50/50 transition-colors"
              >
                <span className="text-3xl">{sponsor.logo}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900">{sponsor.name}</h4>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{sponsor.category} · {sponsor.city}</p>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-right">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{sponsor.redemptions}</p>
                    <p className="text-[10px] text-gray-400">redemptions</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{(sponsor.monthlyBudget / 1000).toFixed(0)}K</p>
                    <p className="text-[10px] text-gray-400">MAD/month</p>
                  </div>
                  <div>
                    <p className={clsx('text-sm font-bold', daysLeft > 90 ? 'text-emerald-600' : daysLeft > 30 ? 'text-amber-600' : 'text-red-600')}>
                      {daysLeft}d
                    </p>
                    <p className="text-[10px] text-gray-400">contract left</p>
                  </div>
                </div>
                <ChevronDown size={16} className={clsx('text-gray-400 transition-transform', isExpanded && 'rotate-180')} />
              </button>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                        {/* Contact */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</p>
                          <div className="space-y-1.5">
                            <p className="text-sm text-gray-900 flex items-center gap-2">
                              <Users size={13} className="text-gray-400" /> {sponsor.contactName}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Mail size={13} className="text-gray-400" /> {sponsor.contactEmail}
                            </p>
                            {sponsor.phone && (
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Phone size={13} className="text-gray-400" /> {sponsor.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Reward Details */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Reward Offered</p>
                          <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                            <div className="flex items-center gap-2">
                              <Gift size={14} className="text-red-500" />
                              <p className="text-sm font-medium text-red-700">{sponsor.rewardType}</p>
                            </div>
                          </div>
                        </div>

                        {/* Contract Info */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contract</p>
                          <div className="space-y-1.5">
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Calendar size={13} className="text-gray-400" />
                              Since {new Date(sponsor.since).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Calendar size={13} className="text-gray-400" />
                              Expires {new Date(sponsor.contract).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                              <Award size={13} className="text-amber-500" />
                              Total invested: {(sponsor.totalInvested / 1000).toFixed(0)}K MAD
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Performance Bar */}
                      <div className="mt-4 p-3 rounded-xl bg-gray-50">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                          <span>Reward Utilization</span>
                          <span className="font-medium text-gray-900">{sponsor.redemptions} redemptions</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all"
                            style={{ width: `${Math.min((sponsor.redemptions / 300) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No partners match your search</p>
        </div>
      )}
    </div>
  );
}
