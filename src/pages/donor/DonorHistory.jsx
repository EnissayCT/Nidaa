import { Calendar, Droplets, Activity, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { donationHistory, bloodAnalysis } from '../../data/mockData';
import BloodTypeBadge from '../../components/common/BloodTypeBadge';

export default function DonorHistory() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Donations', value: donationHistory.length, icon: Droplets, color: 'bg-red-50 text-red-600' },
          { label: 'Total Volume', value: '5,400 ml', icon: Activity, color: 'bg-blue-50 text-blue-600' },
          { label: 'This Year', value: '2', icon: Calendar, color: 'bg-amber-50 text-amber-600' },
          { label: 'All Completed', value: '100%', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
        ].map((s) => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={`p-2 rounded-xl ${s.color.split(' ')[0]}`}>
              <s.icon size={18} className={s.color.split(' ')[1]} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Blood Analysis Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Blood Analysis Trends</h3>
            <p className="text-sm text-gray-500">Key health metrics from your donation records</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={[...bloodAnalysis].reverse()} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="hemoglobin" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} name="Hemoglobin (g/dL)" />
            <Line type="monotone" dataKey="hematocrit" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Hematocrit (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Donation Timeline */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Donation Timeline</h3>
        <div className="space-y-0">
          {donationHistory.map((d, i) => (
            <div key={d.id} className="relative flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 z-10 border-2 border-white">
                  <Droplets size={16} className="text-red-500" />
                </div>
                {i < donationHistory.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gray-100 -my-1" />
                )}
              </div>

              {/* Content */}
              <div className="pb-8 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {d.type} — {d.volume}
                    </p>
                    <p className="text-sm text-gray-500">{d.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                      +{d.points} pts
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(d.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="text-xs bg-gray-50 px-2 py-1 rounded-lg text-gray-600">
                    Hemoglobin: <strong>{d.hemoglobin} g/dL</strong>
                  </span>
                  <span className="text-xs bg-gray-50 px-2 py-1 rounded-lg text-gray-600">
                    BP: <strong>{d.bloodPressure}</strong>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg">
                    <CheckCircle2 size={10} />
                    Completed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
