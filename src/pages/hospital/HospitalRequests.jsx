import { useState } from 'react';
import { Plus, Search, Filter, Clock, CheckCircle2, AlertTriangle, Users, Brain } from 'lucide-react';
import clsx from 'clsx';
import { bloodRequests, bloodTypes } from '../../data/mockData';
import BloodTypeBadge from '../../components/common/BloodTypeBadge';

const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };

export default function HospitalRequests() {
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const filtered = filter === 'all'
    ? [...bloodRequests].sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency])
    : bloodRequests.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{bloodRequests.length} total requests · {bloodRequests.filter((r) => r.status === 'active').length} active</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2">
          <Plus size={16} /> New Blood Request
        </button>
      </div>

      {/* New Request Form */}
      {showForm && (
        <div className="card p-6 border-red-100">
          <h3 className="font-semibold text-gray-900 mb-4">Create New Blood Request</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Blood Type</label>
              <select className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none">
                {bloodTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Units Needed</label>
              <input type="number" defaultValue={1} min={1} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Urgency</label>
              <select className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none">
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium" selected>Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Reason</label>
              <input type="text" placeholder="e.g. Emergency Surgery" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button className="btn-primary text-sm py-2">
              <Brain size={14} /> Submit & AI Match Donors
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm py-2">Cancel</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-400" />
        {['all', 'active', 'fulfilled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors',
              filter === f ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="space-y-3">
        {filtered.map((req) => (
          <div key={req.id} className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <BloodTypeBadge type={req.bloodType} size="lg" urgency={req.urgency} />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{req.id}</h4>
                    <span className={clsx(
                      'text-xs font-medium px-2 py-0.5 rounded-full capitalize',
                      req.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    )}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{req.hospital}, {req.city}</p>
                  <p className="text-sm text-gray-500">{req.reason} · {req.units} units requested</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Users size={14} />
                  <span><strong className="text-gray-900">{req.matchedDonors}</strong> matched</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock size={14} />
                  <span>{req.responseTime}</span>
                </div>
                {req.status === 'active' && (
                  <button className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors">
                    View Matches
                  </button>
                )}
                {req.status === 'fulfilled' && (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 size={14} />
                    <span className="text-xs font-medium">Fulfilled</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
