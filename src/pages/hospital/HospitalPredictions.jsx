import { useState, useEffect, useMemo } from 'react';
import { Brain, RefreshCw, AlertTriangle, CheckCircle2, TrendingUp, Zap, Shield, BarChart3, Activity, Clock, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Cell } from 'recharts';
import PredictionChart from '../../components/charts/PredictionChart';
import AILoadingIndicator from '../../components/common/AILoadingIndicator';
import BloodTypeBadge from '../../components/common/BloodTypeBadge';
import useAISimulation from '../../hooks/useAISimulation';
import { predictBloodDemand, analyzeShortageRisk } from '../../services/aiService';
import { shortageAlerts, bloodStock } from '../../data/mockData';
import clsx from 'clsx';

// Per-blood-type 7-day micro-forecast (simulated)
const bloodTypeForecast = [
  { type: 'O+', current: 189, predicted7d: 162, trend: -14.3, risk: 'low', weeklyDemand: [42, 38, 45, 40, 37, 44, 41] },
  { type: 'O-', current: 31, predicted7d: 18, trend: -41.9, risk: 'critical', weeklyDemand: [6, 8, 5, 7, 9, 6, 8] },
  { type: 'A+', current: 145, predicted7d: 128, trend: -11.7, risk: 'low', weeklyDemand: [28, 25, 30, 22, 27, 24, 29] },
  { type: 'A-', current: 23, predicted7d: 14, trend: -39.1, risk: 'high', weeklyDemand: [4, 5, 3, 6, 4, 5, 3] },
  { type: 'B+', current: 112, predicted7d: 98, trend: -12.5, risk: 'low', weeklyDemand: [18, 20, 16, 22, 19, 17, 21] },
  { type: 'B-', current: 15, predicted7d: 6, trend: -60.0, risk: 'critical', weeklyDemand: [3, 4, 2, 5, 3, 4, 3] },
  { type: 'AB+', current: 67, predicted7d: 55, trend: -17.9, risk: 'medium', weeklyDemand: [8, 10, 7, 9, 11, 8, 10] },
  { type: 'AB-', current: 8, predicted7d: 2, trend: -75.0, risk: 'critical', weeklyDemand: [2, 1, 3, 1, 2, 1, 2] },
];

// Regional risk radar data
const regionalRisk = [
  { region: 'Rabat-Salé', riskScore: 72, donorDensity: 85, stockLevel: 60, responseTime: 92 },
  { region: 'Casablanca', riskScore: 45, donorDensity: 95, stockLevel: 78, responseTime: 88 },
  { region: 'Fès-Meknès', riskScore: 68, donorDensity: 55, stockLevel: 42, responseTime: 70 },
  { region: 'Marrakech', riskScore: 58, donorDensity: 62, stockLevel: 55, responseTime: 75 },
  { region: 'Tanger', riskScore: 52, donorDensity: 70, stockLevel: 65, responseTime: 80 },
  { region: 'Souss-Massa', riskScore: 65, donorDensity: 48, stockLevel: 38, responseTime: 65 },
];

const RISK_COLORS = { low: 'text-emerald-600 bg-emerald-50', medium: 'text-amber-600 bg-amber-50', high: 'text-orange-600 bg-orange-50', critical: 'text-red-600 bg-red-50' };
const BAR_COLORS = { low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#dc2626' };

export default function HospitalPredictions() {
  const prediction = useAISimulation();
  const riskAnalysis = useAISimulation();
  const [predictionResult, setPredictionResult] = useState(null);
  const [riskResult, setRiskResult] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('Rabat-Salé-Kénitra');

  const regions = ['Rabat-Salé-Kénitra', 'Casablanca-Settat', 'Fès-Meknès', 'Marrakech-Safi', 'Tanger-Tétouan', 'Souss-Massa'];

  useEffect(() => {
    handleRunPrediction();
  }, []);

  const handleRunPrediction = async () => {
    const result = await prediction.run(() => predictBloodDemand(selectedRegion, 14));
    setPredictionResult(result);
  };

  const handleRunRisk = async () => {
    const result = await riskAnalysis.run(
      () => analyzeShortageRisk(selectedRegion),
      [
        'Analyzing current stock levels across all blood banks...',
        'Cross-referencing with historical demand patterns...',
        'Evaluating seasonal and event-based risk factors...',
        'Computing shortage probability per blood type...',
        'Running MindSpore LSTM inference on 90-day window...',
        'Generating preventive recommendations...',
        'Risk analysis complete',
      ]
    );
    setRiskResult(result);
  };

  // Summary KPIs
  const kpis = useMemo(() => {
    const criticalCount = bloodTypeForecast.filter((b) => b.risk === 'critical').length;
    const avgTrend = (bloodTypeForecast.reduce((s, b) => s + b.trend, 0) / bloodTypeForecast.length).toFixed(1);
    const totalStock = bloodStock.reduce((s, b) => s + b.units, 0);
    const totalCapacity = bloodStock.reduce((s, b) => s + b.capacity, 0);
    return [
      { label: 'Total Stock', value: `${totalStock} units`, sub: `of ${totalCapacity} capacity`, icon: Layers, color: 'text-blue-600 bg-blue-50' },
      { label: 'Critical Types', value: `${criticalCount} types`, sub: 'need urgent action', icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
      { label: 'Avg 7-Day Trend', value: `${avgTrend}%`, sub: 'projected change', icon: avgTrend < 0 ? ArrowDownRight : ArrowUpRight, color: avgTrend < -20 ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50' },
      { label: 'AI Confidence', value: '94.8%', sub: 'forecast reliability', icon: Shield, color: 'text-emerald-600 bg-emerald-50' },
    ];
  }, []);

  return (
    <div className="space-y-6">
      {/* AI Status Banner */}
      <div className="card p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI Prediction Engine</h3>
            <p className="text-sm text-gray-400">MindSpore v2.3 · LSTM Demand Forecaster v2.1.0 · DenseNet Matcher v1.0.0</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs border border-white/20 outline-none"
          >
            {regions.map((r) => <option key={r} value={r} className="text-gray-900">{r}</option>)}
          </select>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle2 size={12} />
            Models Online
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="card p-4 flex items-center gap-3">
            <div className={clsx('p-2.5 rounded-xl', k.color.split(' ')[1])}>
              <k.icon size={18} className={k.color.split(' ')[0]} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{k.value}</p>
              <p className="text-xs text-gray-500">{k.label}</p>
              <p className="text-[10px] text-gray-400">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Demand Forecast */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Blood Demand Forecast</h3>
              <p className="text-sm text-gray-500">14-day prediction for {selectedRegion}</p>
            </div>
            <button
              onClick={handleRunPrediction}
              disabled={prediction.loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={prediction.loading ? 'animate-spin' : ''} />
              Re-run Prediction
            </button>
          </div>

          {prediction.loading && <AILoadingIndicator loading progress={prediction.progress} stage={prediction.stage} />}

          {!prediction.loading && (
            <>
              <PredictionChart height={320} />
              <div className="flex items-center gap-6 mt-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500 rounded-full" /> AI Predicted</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 rounded-full" /> Actual</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-50 border border-amber-200 rounded" /> Confidence Band</span>
              </div>
            </>
          )}

          {predictionResult && !prediction.loading && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-100">
              {[
                { label: 'Confidence', value: `${Math.round(predictionResult.confidence * 100)}%`, icon: Shield },
                { label: 'Alerts', value: `${predictionResult.alerts} high-risk`, icon: AlertTriangle },
                { label: 'Compute Time', value: predictionResult.computeTime, icon: Zap },
                { label: 'Model', value: predictionResult.modelVersion, icon: Brain },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50">
                  <m.icon size={14} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">{m.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Per Blood Type */}
      <div className="space-y-4">
        {/* Blood Type Demand Heatmap Grid */}
        <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-1">7-Day Per-Type Forecast</h3>
            <p className="text-sm text-gray-500 mb-4">Projected stock levels and daily demand by blood type</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Type</th>
                    <th className="text-center py-2 px-2 text-xs font-medium text-gray-500">Now</th>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                      <th key={d} className="text-center py-2 px-2 text-xs font-medium text-gray-500">{d}</th>
                    ))}
                    <th className="text-center py-2 px-2 text-xs font-medium text-gray-500">Day 7</th>
                    <th className="text-center py-2 px-2 text-xs font-medium text-gray-500">Trend</th>
                    <th className="text-center py-2 px-2 text-xs font-medium text-gray-500">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {bloodTypeForecast.map((bt) => (
                    <tr key={bt.type} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-2.5 px-2">
                        <BloodTypeBadge type={bt.type} size="sm" />
                      </td>
                      <td className="text-center py-2.5 px-2 font-semibold text-gray-900">{bt.current}</td>
                      {bt.weeklyDemand.map((d, i) => {
                        const intensity = d / Math.max(...bt.weeklyDemand);
                        return (
                          <td key={i} className="text-center py-2.5 px-2">
                            <span
                              className="inline-block w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center"
                              style={{
                                backgroundColor: `rgba(220, 38, 38, ${0.08 + intensity * 0.35})`,
                                color: intensity > 0.7 ? '#991b1b' : '#6b7280',
                              }}
                            >
                              {d}
                            </span>
                          </td>
                        );
                      })}
                      <td className="text-center py-2.5 px-2 font-semibold text-gray-900">{bt.predicted7d}</td>
                      <td className="text-center py-2.5 px-2">
                        <span className={clsx('text-xs font-medium', bt.trend < -30 ? 'text-red-600' : bt.trend < -15 ? 'text-amber-600' : 'text-emerald-600')}>
                          {bt.trend > 0 ? '+' : ''}{bt.trend}%
                        </span>
                      </td>
                      <td className="text-center py-2.5 px-2">
                        <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase', RISK_COLORS[bt.risk])}>
                          {bt.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bar Chart — Projected Depletion */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-1">Projected Stock After 7 Days</h3>
            <p className="text-sm text-gray-500 mb-4">Current vs projected stock levels per blood type</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={bloodTypeForecast} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
                <Bar dataKey="current" name="Current Stock" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predicted7d" name="Projected (7d)" radius={[4, 4, 0, 0]}>
                  {bloodTypeForecast.map((entry) => (
                    <Cell key={entry.type} fill={BAR_COLORS[entry.risk]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      {/* Regional Analysis */}
      <div className="space-y-4">
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Regional Risk Radar</h3>
            <p className="text-sm text-gray-500 mb-4">Multi-dimensional comparison across regions</p>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={regionalRisk}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="region" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Risk Score" dataKey="riskScore" stroke="#dc2626" fill="#dc2626" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Donor Density" dataKey="donorDensity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                <Radar name="Stock Level" dataKey="stockLevel" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {regionalRisk.map((r) => (
              <div key={r.region} className="card p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">{r.region}</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Risk Score', value: r.riskScore, max: 100, color: r.riskScore > 65 ? 'bg-red-500' : r.riskScore > 50 ? 'bg-amber-500' : 'bg-emerald-500' },
                    { label: 'Donor Density', value: r.donorDensity, max: 100, color: 'bg-blue-500' },
                    { label: 'Stock Level', value: r.stockLevel, max: 100, color: r.stockLevel < 50 ? 'bg-red-500' : 'bg-emerald-500' },
                    { label: 'Response Time', value: r.responseTime, max: 100, color: 'bg-purple-500' },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-gray-500">{bar.label}</span>
                        <span className="font-medium text-gray-700">{bar.value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={clsx('h-full rounded-full transition-all', bar.color)} style={{ width: `${bar.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Risk Analysis */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Shortage Risk Analysis</h3>
            <p className="text-sm text-gray-500">AI-powered comprehensive risk assessment for {selectedRegion}</p>
          </div>
          <button
            onClick={handleRunRisk}
            disabled={riskAnalysis.loading}
            className="btn-primary text-sm py-2"
          >
            <Brain size={14} />
            {riskAnalysis.loading ? 'Analyzing...' : 'Run Risk Analysis'}
          </button>
        </div>

        {riskAnalysis.loading && <AILoadingIndicator loading progress={riskAnalysis.progress} stage={riskAnalysis.stage} />}

        {riskResult && !riskAnalysis.loading && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-xs text-amber-600 font-medium">Overall Risk Level</p>
                <p className="text-2xl font-bold text-amber-700 capitalize mt-1">{riskResult.overallRisk}</p>
                <p className="text-xs text-amber-600 mt-1">Score: {riskResult.riskScore}</p>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                <p className="text-xs text-red-600 font-medium">Critical Types</p>
                <div className="flex gap-1.5 mt-2">
                  {riskResult.criticalTypes.map((t) => (
                    <BloodTypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-xs text-emerald-600 font-medium">Confidence</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">{Math.round(riskResult.confidence * 100)}%</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">AI Recommendations</h4>
              <div className="space-y-2">
                {riskResult.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <TrendingUp size={14} className="text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!riskResult && !riskAnalysis.loading && (
          <div className="text-center py-12 text-gray-400">
            <Brain size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Click "Run Risk Analysis" to generate AI-powered insights</p>
          </div>
        )}
      </div>

      {/* Active Shortage Alerts */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-amber-500" />
          <h3 className="font-semibold text-gray-900">Current Shortage Alerts</h3>
          <span className="ml-auto text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> Updated 2 min ago</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {shortageAlerts.map((alert) => (
            <div key={alert.id} className={clsx(
              'p-4 rounded-xl border flex items-center justify-between',
              alert.severity === 'critical' ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
            )}>
              <div className="flex items-center gap-3">
                <BloodTypeBadge type={alert.bloodType} urgency={alert.severity} size="lg" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{alert.region}</p>
                  <p className="text-xs text-gray-500">Predicted shortage: {alert.predictedDate}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">AI confidence: {Math.round(alert.confidence * 100)}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{alert.currentStock}</p>
                <p className="text-xs text-gray-500">of {alert.minRequired} needed</p>
                <div className="h-1.5 w-16 rounded-full bg-gray-200 overflow-hidden mt-1 ml-auto">
                  <div
                    className={clsx('h-full rounded-full', alert.currentStock / alert.minRequired < 0.4 ? 'bg-red-500' : 'bg-amber-500')}
                    style={{ width: `${Math.min(100, (alert.currentStock / alert.minRequired) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
