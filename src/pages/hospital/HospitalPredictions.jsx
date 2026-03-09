import { useState, useEffect } from 'react';
import { Brain, RefreshCw, AlertTriangle, CheckCircle2, TrendingUp, Zap, Shield } from 'lucide-react';
import PredictionChart from '../../components/charts/PredictionChart';
import AILoadingIndicator from '../../components/common/AILoadingIndicator';
import BloodTypeBadge from '../../components/common/BloodTypeBadge';
import useAISimulation from '../../hooks/useAISimulation';
import { predictBloodDemand, analyzeShortageRisk } from '../../services/aiService';
import { shortageAlerts } from '../../data/mockData';

export default function HospitalPredictions() {
  const prediction = useAISimulation();
  const riskAnalysis = useAISimulation();
  const [predictionResult, setPredictionResult] = useState(null);
  const [riskResult, setRiskResult] = useState(null);

  // Auto-run prediction on mount
  useEffect(() => {
    handleRunPrediction();
  }, []);

  const handleRunPrediction = async () => {
    const result = await prediction.run(() => predictBloodDemand('Rabat-Salé-Kénitra', 14));
    setPredictionResult(result);
  };

  const handleRunRisk = async () => {
    const result = await riskAnalysis.run(
      () => analyzeShortageRisk('Rabat-Salé-Kénitra'),
      [
        'Analyzing current stock levels across all blood banks...',
        'Cross-referencing with historical demand patterns...',
        'Evaluating seasonal and event-based risk factors...',
        'Computing shortage probability per blood type...',
        'Generating preventive recommendations...',
        'Risk analysis complete',
      ]
    );
    setRiskResult(result);
  };

  return (
    <div className="space-y-6">
      {/* AI Status Banner */}
      <div className="card p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI Prediction Engine</h3>
            <p className="text-sm text-gray-400">MindSpore v2.3 · Blood Demand Forecaster v2.1.0</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle2 size={12} />
            Model Online
          </div>
        </div>
      </div>

      {/* Prediction Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Blood Demand Forecast</h3>
            <p className="text-sm text-gray-500">14-day prediction for Rabat-Salé-Kénitra region</p>
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

        {/* Prediction Metadata */}
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

      {/* Risk Analysis */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Shortage Risk Analysis</h3>
            <p className="text-sm text-gray-500">AI-powered comprehensive risk assessment</p>
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
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {shortageAlerts.map((alert) => (
            <div key={alert.id} className="p-4 rounded-xl border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BloodTypeBadge type={alert.bloodType} urgency={alert.severity} size="lg" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{alert.region}</p>
                  <p className="text-xs text-gray-500">Predicted shortage: {alert.predictedDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{alert.currentStock}</p>
                <p className="text-xs text-gray-500">of {alert.minRequired} needed</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
