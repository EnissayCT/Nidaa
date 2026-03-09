import { useState } from 'react';
import { Search, Filter, MoreVertical, UserCheck, UserX, Shield, Building2, Heart } from 'lucide-react';
import clsx from 'clsx';
import { adminUsers } from '../../data/mockData';

const roleIcons = { admin: Shield, hospital: Building2, donor: Heart };
const roleColors = { admin: 'bg-purple-100 text-purple-700', hospital: 'bg-blue-100 text-blue-700', donor: 'bg-red-100 text-red-700' };
const statusColors = { active: 'bg-emerald-100 text-emerald-700', inactive: 'bg-gray-100 text-gray-500' };

export default function AdminUsers() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? adminUsers : adminUsers.filter((u) => u.role === filter);

  const counts = {
    all: adminUsers.length,
    admin: adminUsers.filter((u) => u.role === 'admin').length,
    hospital: adminUsers.filter((u) => u.role === 'hospital').length,
    donor: adminUsers.filter((u) => u.role === 'donor').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: adminUsers.length, icon: UserCheck, color: 'blue' },
          { label: 'Admins', value: counts.admin, icon: Shield, color: 'purple' },
          { label: 'Hospitals', value: counts.hospital, icon: Building2, color: 'blue' },
          { label: 'Donors', value: counts.donor, icon: Heart, color: 'red' },
        ].map((s) => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={clsx('p-2 rounded-xl', s.color === 'purple' ? 'bg-purple-50' : s.color === 'blue' ? 'bg-blue-50' : 'bg-red-50')}>
              <s.icon size={18} className={clsx(s.color === 'purple' ? 'text-purple-600' : s.color === 'blue' ? 'text-blue-600' : 'text-red-600')} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            {['all', 'admin', 'hospital', 'donor'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors',
                  filter === f ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {f} ({counts[f]})
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 text-sm">
            <Search size={16} className="text-gray-400" />
            <input placeholder="Search users..." className="bg-transparent outline-none text-sm w-48" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">City</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => {
                const RoleIcon = roleIcons[user.role];
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-sm font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium capitalize', roleColors[user.role])}>
                        <RoleIcon size={12} />
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium capitalize', statusColors[user.status])}>
                        {user.status === 'active' ? <UserCheck size={12} /> : <UserX size={12} />}
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{user.city}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
