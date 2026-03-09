import { useState, useCallback } from 'react';

/**
 * Hook that simulates AI processing with loading states and progressive updates.
 * Wraps any async AI service call with convincing "processing" UX.
 */
export default function useAISimulation() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const stages = [
    'Collecting data from regional hospitals...',
    'Preprocessing features & normalizing inputs...',
    'Running MindSpore inference pipeline...',
    'Analyzing patterns with neural network...',
    'Computing confidence intervals...',
    'Generating recommendations...',
  ];

  const run = useCallback(async (asyncFn, customStages) => {
    const stageList = customStages || stages;
    setLoading(true);
    setProgress(0);
    setStage(stageList[0]);
    setResult(null);
    setError(null);

    // Simulate progressive stages
    const stageInterval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 18 + 5, 90);
        const stageIdx = Math.min(
          Math.floor((next / 100) * stageList.length),
          stageList.length - 1
        );
        setStage(stageList[stageIdx]);
        return next;
      });
    }, 400);

    try {
      const data = await asyncFn();
      clearInterval(stageInterval);
      setProgress(100);
      setStage('Complete');
      setResult(data);
      return data;
    } catch (err) {
      clearInterval(stageInterval);
      setError(err.message || 'AI processing failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setProgress(0);
    setStage('');
    setResult(null);
    setError(null);
  }, []);

  return { loading, progress, stage, result, error, run, reset };
}
