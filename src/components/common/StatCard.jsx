import clsx from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ label, value, change, trend, icon: Icon, color = 'red', className }) {
  const colors = {
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const trendColors = {
    up: 'text-emerald-600',
    down: 'text-red-500',
    stable: 'text-gray-400',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className={clsx('card p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
          {change && (
            <div className={clsx('flex items-center gap-1 mt-1.5 text-xs font-medium', trendColors[trend])}>
              <TrendIcon size={14} />
              <span>{change}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={clsx('p-2.5 rounded-xl', colors[color])}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
