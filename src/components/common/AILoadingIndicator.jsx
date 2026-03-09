import { Brain } from 'lucide-react';
import clsx from 'clsx';

export default function AILoadingIndicator({ progress = 0, stage = '', loading = false, compact = false }) {
  if (!loading) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <Brain size={16} className="animate-pulse" />
        <span className="font-medium">{stage || 'Processing...'}</span>
      </div>
    );
  }

  return (
    <div className="card p-6 border-red-100 ai-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center">
          <Brain size={20} className="text-white animate-pulse" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Processing</h3>
          <p className="text-sm text-gray-500">MindSpore Inference Pipeline</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={clsx('font-medium', progress === 100 ? 'text-emerald-600' : 'text-gray-600')}>
          {stage}
        </span>
        <span className="text-gray-400 tabular-nums">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
