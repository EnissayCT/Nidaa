import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Brain, Droplets, AlertTriangle,
  BarChart3, MapPin, History, Heart, Trophy, LogOut, Activity, X,
} from 'lucide-react';
import clsx from 'clsx';

const navigation = {
  admin: [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/admin/users', label: 'Users & Accounts', icon: Users },
    { path: '/admin/ai', label: 'AI Models', icon: Brain },
  ],
  hospital: [
    { path: '/hospital', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/hospital/requests', label: 'Blood Requests', icon: AlertTriangle },
    { path: '/hospital/stock', label: 'Stock Management', icon: Droplets },
    { path: '/hospital/predictions', label: 'AI Predictions', icon: BarChart3 },
  ],
  donor: [
    { path: '/donor', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/donor/nearby', label: 'Donation Centers', icon: MapPin },
    { path: '/donor/history', label: 'My Donations', icon: History },
    { path: '/donor/impact', label: 'My Impact', icon: Heart },
    { path: '/donor/rewards', label: 'Rewards', icon: Trophy },
  ],
};

const roleLabels = {
  admin: { title: 'NIDAA Admin', subtitle: 'Platform Management' },
  hospital: { title: 'CHU Ibn Sina', subtitle: 'Hospital Portal' },
  donor: { title: 'Amine Tiyane', subtitle: 'Donor Portal' },
};

export default function Sidebar({ role, onClose }) {
  const nav = navigation[role] || [];
  const info = roleLabels[role];
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-lg font-bold shadow-lg shadow-red-600/30">
            N
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              NIDAA <span className="font-arabic text-sm opacity-60">نداء</span>
            </h1>
            <p className="text-[11px] text-gray-400 -mt-0.5">AI Blood Donation Platform</p>
          </div>
        </button>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* AI Status */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-xs text-gray-400">
          <Activity size={14} className="text-emerald-400" />
          <span>AI Models: <span className="text-emerald-400 font-medium">Online</span></span>
        </div>
      </div>

      {/* User & Logout */}
      <div className="px-4 pb-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-sm font-bold">
            {info.title.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{info.title}</p>
            <p className="text-[11px] text-gray-500 truncate">{info.subtitle}</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
