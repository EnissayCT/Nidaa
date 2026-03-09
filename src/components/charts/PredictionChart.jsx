import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { demandForecast } from '../../data/mockData';

export default function PredictionChart({ data = demandForecast, height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="confGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />
        <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confGradient)" />
        <Area type="monotone" dataKey="lower" stroke="none" fill="transparent" />
        <Area type="monotone" dataKey="predicted" stroke="#dc2626" strokeWidth={2} fill="url(#predGradient)" dot={{ r: 3, fill: '#dc2626' }} />
        <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} connectNulls={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
