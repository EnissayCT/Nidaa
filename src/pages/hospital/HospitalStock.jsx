import { Droplets, AlertTriangle, Clock, TrendingUp, TrendingDown, Minus, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import clsx from 'clsx';
import { bloodStock } from '../../data/mockData';
import BloodTypeBadge from '../../components/common/BloodTypeBadge';

const trendIcons = { rising: TrendingUp, declining: TrendingDown, stable: Minus, critical: AlertTriangle };
const trendColors = { rising: 'text-emerald-600', declining: 'text-amber-600', stable: 'text-gray-400', critical: 'text-red-600' };

export default function HospitalStock() {
  const totalUnits = bloodStock.reduce((s, b) => s + b.units, 0);
  const totalCapacity = bloodStock.reduce((s, b) => s + b.capacity, 0);
  const expiringTotal = bloodStock.reduce((s, b) => s + b.expiringSoon, 0);
  const criticalCount = bloodStock.filter((b) => b.units / b.capacity < 0.25).length;

  // Capacity utilization chart
  const capacityData = bloodStock.map((b) => ({
    type: b.type,
    current: b.units,
    remaining: b.capacity - b.units,
    pct: Math.round((b.units / b.capacity) * 100),
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50"><Droplets size={18} className="text-red-600" /></div>
            <div><p className="text-xl font-bold text-gray-900">{totalUnits}</p><p className="text-xs text-gray-500">Total Units</p></div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50"><Package size={18} className="text-blue-600" /></div>
            <div><p className="text-xl font-bold text-gray-900">{Math.round((totalUnits / totalCapacity) * 100)}%</p><p className="text-xs text-gray-500">Capacity Used</p></div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50"><Clock size={18} className="text-amber-600" /></div>
            <div><p className="text-xl font-bold text-gray-900">{expiringTotal}</p><p className="text-xs text-gray-500">Expiring Soon</p></div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50"><AlertTriangle size={18} className="text-red-600" /></div>
            <div><p className="text-xl font-bold text-gray-900">{criticalCount}</p><p className="text-xs text-gray-500">Critical Types</p></div>
          </div>
        </div>
      </div>

      {/* Stock Detail Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {bloodStock.map((stock) => {
          const pct = Math.round((stock.units / stock.capacity) * 100);
          const TrendIcon = trendIcons[stock.trend];
          const isCritical = pct < 25;
          const isLow = pct < 50;

          return (
            <div key={stock.type} className={clsx('card p-5', isCritical && 'border-red-200 bg-red-50/30')}>
              <div className="flex items-center justify-between mb-3">
                <BloodTypeBadge type={stock.type} size="lg" />
                <div className={clsx('flex items-center gap-1 text-xs font-medium', trendColors[stock.trend])}>
                  <TrendIcon size={14} />
                  <span className="capitalize">{stock.trend}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-gray-900">{stock.units}</span>
                  <span className="text-sm text-gray-500">/ {stock.capacity}</span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={clsx('h-full rounded-full transition-all', isCritical ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500')}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>{pct}% capacity</span>
                  <span>{stock.expiringSoon} expiring</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                  <TrendingUp size={12} />
                  <span>+{stock.incoming} incoming</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Capacity Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Capacity Utilization</h3>
            <p className="text-sm text-gray-500">Current stock vs. total capacity per blood type</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={capacityData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="type" tick={{ fontSize: 12, fontWeight: 600 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
            <Bar dataKey="current" stackId="a" fill="#dc2626" radius={[0, 0, 0, 0]} name="Current Stock" />
            <Bar dataKey="remaining" stackId="a" fill="#f3f4f6" radius={[6, 6, 0, 0]} name="Available Space" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
