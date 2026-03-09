import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { donationTrends } from '../../data/mockData';

export default function DonationTrendsChart({ data = donationTrends, height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="donations" stroke="#dc2626" strokeWidth={2} dot={false} name="Donations" />
        <Line type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={2} dot={false} name="Requests" strokeDasharray="4 4" />
      </LineChart>
    </ResponsiveContainer>
  );
}
