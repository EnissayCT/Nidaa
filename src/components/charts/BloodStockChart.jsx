import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { bloodStock } from '../../data/mockData';

const getBarColor = (entry) => {
  const pct = entry.units / entry.capacity;
  if (pct < 0.25) return '#ef4444';
  if (pct < 0.5) return '#f59e0b';
  return '#10b981';
};

export default function BloodStockChart({ data = bloodStock, height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="type" tick={{ fontSize: 12, fontWeight: 600 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
          formatter={(value, name) => [`${value} units`, name === 'units' ? 'Current Stock' : name]}
        />
        <Bar dataKey="units" radius={[6, 6, 0, 0]} maxBarSize={40}>
          {data.map((entry, index) => (
            <Cell key={index} fill={getBarColor(entry)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
