import { useState } from 'react';
import { Brain, Cpu, Clock, Database, RefreshCw, CheckCircle2, Loader2, Zap, BarChart3, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';
import { aiModels } from '../../data/mockData';
import AILoadingIndicator from '../../components/common/AILoadingIndicator';
import useAISimulation from '../../hooks/useAISimulation';

// Simulated training history data
const trainingHistory = Array.from({ length: 12 }, (_, i) => ({
  epoch: `E${i + 1}`,
  accuracy: Math.min(60 + i * 4 + Math.random() * 3, 95).toFixed(1),
  loss: Math.max(0.8 - i * 0.06 + Math.random() * 0.02, 0.08).toFixed(3),
}));

// Model accuracy history (monthly)
const accuracyHistory = [
  { month: 'Oct', mae: 4.2, rmse: 5.8, accuracy: 91.2 },
  { month: 'Nov', mae: 3.8, rmse: 5.1, accuracy: 92.5 },
  { month: 'Dec', mae: 5.1, rmse: 6.9, accuracy: 89.1 },
  { month: 'Jan', mae: 3.5, rmse: 4.8, accuracy: 93.0 },
  { month: 'Feb', mae: 3.1, rmse: 4.3, accuracy: 94.2 },
  { month: 'Mar', mae: 2.9, rmse: 4.0, accuracy: 94.8 },
];

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  training: 'bg-amber-100 text-amber-700',
  inactive: 'bg-gray-100 text-gray-500',
};

const statusIcons = {
  active: CheckCircle2,
  training: Loader2,
  inactive: Clock,
};

export default function AdminAI() {
  const { loading, progress, stage, run } = useAISimulation();
  const [retrainingModel, setRetrainingModel] = useState(null);

  const handleRetrain = async (modelId) => {
    setRetrainingModel(modelId);
    await run(
      () => new Promise((r) => setTimeout(r, 4000)),
      [
        'Fetching latest training data from regional hospitals...',
        'Validating data quality and preprocessing features...',
        'Initializing MindSpore training graph on Ascend NPU...',
        'Training model — Epoch 1/12...',
        'Training model — Epoch 6/12...',
        'Evaluating model on validation set...',
        'Deploying updated model to inference endpoint...',
        'Model retraining completed successfully',
      ]
    );
    setRetrainingModel(null);
  };

  return (
    <div className="space-y-6">
      {/* AI Loading Indicator */}
      {loading && <AILoadingIndicator loading={loading} progress={progress} stage={stage} />}

      {/* Model Cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {aiModels.map((model) => {
          const StatusIcon = statusIcons[model.status];
          return (
            <div key={model.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center">
                  <Brain size={20} className="text-white" />
                </div>
                <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium capitalize', statusColors[model.status])}>
                  <StatusIcon size={12} className={model.status === 'training' ? 'animate-spin' : ''} />
                  {model.status}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900">{model.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{model.description}</p>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="p-2.5 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">Accuracy</p>
                  <p className="text-lg font-bold text-gray-900">{model.accuracy}%</p>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">Inference</p>
                  <p className="text-lg font-bold text-gray-900">{model.inferenceTime}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">Data Points</p>
                  <p className="text-sm font-semibold text-gray-900">{model.dataPoints}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">Version</p>
                  <p className="text-sm font-semibold text-gray-900">{model.version}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Cpu size={12} />
                  {model.framework}
                </div>
                <button
                  onClick={() => handleRetrain(model.id)}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  <RefreshCw size={12} className={retrainingModel === model.id ? 'animate-spin' : ''} />
                  Retrain
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Training History Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Training History</h3>
            <p className="text-sm text-gray-500">Blood Demand Forecaster — Latest training run</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-red-500 rounded-full" />
              <span className="text-gray-500">Accuracy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-blue-500 rounded-full" />
              <span className="text-gray-500">Loss</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trainingHistory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="epoch" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} domain={[50, 100]} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} domain={[0, 1]} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
            <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
            <Line yAxisId="right" type="monotone" dataKey="loss" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Model Performance */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-1">
          <Target size={18} className="text-red-500" />
          <h3 className="font-semibold text-gray-900">Model Performance</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Monthly forecast accuracy and error metrics (lower MAE = better)</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={accuracyHistory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="mae" name="MAE" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rmse" name="RMSE" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="accuracy" name="Accuracy %" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Model Detail Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'LSTM Demand Forecaster', version: 'v2.1.0', framework: 'MindSpore 2.3', params: '1.2M', trainedOn: '180k records', lastRetrain: 'Feb 28, 2026', accuracy: '94.8%' },
          { label: 'DenseNet Donor Matcher', version: 'v1.0.0', framework: 'MindSpore 2.3', params: '890k', trainedOn: '45k donor pairs', lastRetrain: 'Mar 1, 2026', accuracy: '92.1%' },
          { label: 'Risk Assessment Engine', version: 'v1.2.0', framework: 'MindSpore 2.3', params: '650k', trainedOn: '12k events', lastRetrain: 'Mar 3, 2026', accuracy: '91.5%' },
        ].map((m) => (
          <div key={m.label} className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={16} className="text-red-500" />
              <h4 className="text-sm font-semibold text-gray-900">{m.label}</h4>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Version</span><span className="font-medium text-gray-700">{m.version}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Framework</span><span className="font-medium text-gray-700">{m.framework}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Parameters</span><span className="font-medium text-gray-700">{m.params}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Training Data</span><span className="font-medium text-gray-700">{m.trainedOn}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Last Retrain</span><span className="font-medium text-gray-700">{m.lastRetrain}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Accuracy</span><span className="font-semibold text-emerald-600">{m.accuracy}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Infrastructure Info */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Infrastructure & Deployment</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Cpu, label: 'Compute', value: 'Huawei Ascend 910B', desc: 'AI Training Accelerator' },
            { icon: Database, label: 'Data Storage', value: 'Huawei OBS', desc: '2.4M+ training samples' },
            { icon: Zap, label: 'Serving', value: 'ModelArts', desc: 'Auto-scaling inference' },
            { icon: BarChart3, label: 'Monitoring', value: 'AOM Suite', desc: 'Real-time model health' },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl bg-gray-50">
              <item.icon size={18} className="text-red-500 mb-2" />
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-sm font-semibold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
