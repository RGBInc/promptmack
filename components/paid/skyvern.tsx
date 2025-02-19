'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface SkyvernTaskDetails {
  task_id: string;
  status: 'created' | 'queued' | 'running' | 'completed' | 'terminated' | 'failed' | 'canceled';
  created_at: string;
  modified_at: string;
  request?: {
    url?: string;
    webhook_callback_url?: string;
    navigation_goal?: string;
    data_extraction_goal?: string;
    navigation_payload?: {
      name?: string;
      email?: string;
      additionalInformation?: string;
      [key: string]: any;
    };
    proxy_location?: string;
    extracted_information_schema?: any;
  };
  extracted_information?: any;
  screenshot_url?: string;
  recording_url?: string;
  action_screenshot_urls?: string[];
  failure_reason?: string;
}

interface SkyvernTaskStep {
  organization_id: string;
  task_id: string;
  step_id: string;
  status: 'created' | 'running' | 'completed' | 'failed' | 'canceled';
  order: number;
  retry_index: number;
  input_token_count: number;
  output_token_count: number;
}

export function Skyvern({ skyvernData }: { skyvernData: { task_id: string } | null }) {
  const [taskDetails, setTaskDetails] = useState<SkyvernTaskDetails | null>(null);
  const [taskSteps, setTaskSteps] = useState<SkyvernTaskStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastErrorTime, setLastErrorTime] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const MAX_RETRIES = 5;
  const MIN_ERROR_INTERVAL = 3000;
  const MAX_BACKOFF_DELAY = 10000;

  const handleError = (err: unknown, errorMessage: string) => {
    const errorDetails = err instanceof Error ? err.message : errorMessage;
    console.error(`Skyvern Error: ${errorMessage}`, {
      error: err,
      timestamp: new Date().toISOString(),
      taskId: skyvernData?.task_id
    });
    const currentTime = Date.now();
    if (currentTime - lastErrorTime >= MIN_ERROR_INTERVAL) {
      setError(`${errorMessage}: ${errorDetails}`);
      setLastErrorTime(currentTime);
    }
  };

  const calculateBackoffDelay = (currentRetry: number) => {
    return Math.min(1000 * Math.pow(2, currentRetry), MAX_BACKOFF_DELAY);
  };

  const retryWithBackoff = async (fn: () => Promise<void>, currentRetry: number) => {
    if (currentRetry >= MAX_RETRIES) {
      setIsRetrying(false);
      return;
    }

    setIsRetrying(true);
    const backoffDelay = calculateBackoffDelay(currentRetry);
    await new Promise(resolve => setTimeout(resolve, backoffDelay));
    await fn();
  };

  const cancelTask = async (taskId: string) => {
    try {
      await fetch(`/api/skyvern/tasks/${taskId}/cancel`, {
        method: 'POST'
      });
      await fetchTaskDetails();
      await fetchTaskSteps(taskId);
    } catch (err) {
      handleError(err, 'Failed to cancel task');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      created: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      queued: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      running: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      completed: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      terminated: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      failed: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      canceled: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.created;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      created: 'bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200',
      queued: 'bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200',
      running: 'bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200',
      completed: 'bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200',
      terminated: 'bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-200',
      failed: 'bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-200',
      canceled: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.created;
  };

  const fetchTaskSteps = async (taskId: string) => {
    try {
      const response = await fetch(`/api/skyvern/tasks/${taskId}/steps`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setTaskSteps(data);
        }
      }
    } catch (err) {
      console.error('Error fetching task steps:', err);
    }
  };

  const fetchTaskDetails = async (currentRetry = 0) => {
    if (!skyvernData?.task_id) return;
    
    try {
      const response = await fetch(`/api/skyvern/tasks/${skyvernData.task_id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': process.env.SKYVERN_API_KEY || ''
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch task details');
      }
      const data = await response.json();
      setTaskDetails(data);
      setError(null);
      setIsRetrying(false);
  
      if (['created', 'queued', 'running'].includes(data.status)) {
        startPolling();
      } else {
        stopPolling();
      }
    } catch (err) {
      handleError(err, 'Failed to fetch task details');
      await retryWithBackoff(() => fetchTaskDetails(currentRetry + 1), currentRetry);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const startPolling = () => {
    if (pollingInterval) return;
    
    const interval = setInterval(() => {
      fetchTaskDetails();
      if (skyvernData?.task_id) {
        fetchTaskSteps(skyvernData.task_id);
      }
    }, 5000);
    
    setPollingInterval(interval);
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  useEffect(() => {
    if (skyvernData?.task_id) {
      fetchTaskDetails();
      fetchTaskSteps(skyvernData.task_id);
    }

    return () => stopPolling();
  }, [skyvernData?.task_id]);

  if (!skyvernData) return null;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
      >
        <div className="flex items-center justify-center py-4">
          <Clock className="h-6 w-6 text-blue-500 dark:text-blue-400 animate-spin" />
          <span className="ml-2 text-blue-700 dark:text-blue-300">Initializing task...</span>
        </div>
      </motion.div>
    );
  }

  if (error || !taskDetails) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-300 font-medium">Task Error</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-300">{error || 'Failed to load task details'}</p>
          {isRetrying && (
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <Clock className="h-4 w-4 animate-spin" />
              <span className="text-sm">Retrying request...</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full border rounded-lg p-4 space-y-4 ${getStatusColor(taskDetails.status)}`}
    >
      {isRetrying && (
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
          <Clock className="h-4 w-4 text-yellow-500 dark:text-yellow-400 animate-spin" />
          <span className="text-sm text-yellow-700 dark:text-yellow-300">Retrying request...</span>
        </div>
      )}
      <div className="flex items-center justify-between px-3 py-2 bg-white/50 dark:bg-black/20 rounded border border-current">
        <span className="text-sm font-medium">Task ID</span>
        <span className={`text-sm px-2 py-0.5 rounded ${getStatusBadgeColor(taskDetails.status)}`}>
          {taskDetails.task_id}
        </span>
      </div>

      <div className="px-3 py-2 bg-white/50 dark:bg-black/20 rounded border border-current">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Status</span>
          <div className="flex items-center gap-2">
            <span className={`text-sm px-2 py-0.5 rounded ${getStatusBadgeColor(taskDetails.status)}`}>
              {taskDetails.status}
            </span>
            {['created', 'queued', 'running'].includes(taskDetails.status) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => cancelTask(taskDetails.task_id)}
                className="h-7 px-2 py-0"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </div>
        <div className="text-xs space-y-1 opacity-75">
          <p>Created: {new Date(taskDetails.created_at).toLocaleString()}</p>
          <p>Last Modified: {new Date(taskDetails.modified_at).toLocaleString()}</p>
        </div>
      </div>

      {taskSteps.length > 0 && (
        <div className="px-3 py-2 bg-white/50 dark:bg-black/20 rounded border border-current">
          <h4 className="text-sm font-medium mb-2">Task Steps</h4>
          <div className="space-y-2">
            {taskSteps.map((step) => (
              <div
                key={step.step_id}
                className={`p-2 rounded border ${getStatusColor(step.status)}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">Step {step.order + 1}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusBadgeColor(step.status)}`}>
                    {step.status}
                  </span>
                </div>
                {step.retry_index > 0 && (
                  <p className="text-xs mt-1 opacity-75">Retry attempt: {step.retry_index}</p>
                )}
                <div className="text-xs mt-1 opacity-75">
                  <p>Input tokens: {step.input_token_count}</p>
                  <p>Output tokens: {step.output_token_count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-3">
          <h3 className="font-medium">Task Details</h3>

          {taskDetails.request?.url && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Target URL</p>
              <a
                href={taskDetails.request.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline break-all block opacity-75"
              >
                {taskDetails.request.url}
              </a>
            </div>
          )}

          {taskDetails.request?.navigation_goal && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Navigation Goal</p>
              <p className="text-sm opacity-75">{taskDetails.request.navigation_goal}</p>
            </div>
          )}

          {taskDetails.request?.navigation_payload && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Form Data</p>
              <dl className="grid gap-2 text-sm bg-white/50 dark:bg-black/20 rounded-md p-3">
                {Object.entries(taskDetails.request.navigation_payload).map(([key, value]) => (
                  <div key={key} className="flex gap-3">
                    <dt className="font-medium capitalize min-w-[120px]">{key}:</dt>
                    <dd className="flex-1 opacity-75">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {taskDetails.extracted_information && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Extracted Information</p>
              <pre className="text-sm bg-white/50 dark:bg-black/20 rounded-md p-3 overflow-x-auto">
                {JSON.stringify(taskDetails.extracted_information, null, 2)}
              </pre>
            </div>
          )}

          {taskDetails.failure_reason && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">Failure Reason</p>
              <p className="text-sm text-red-600 dark:text-red-300">{taskDetails.failure_reason}</p>
            </div>
          )}

          {(taskDetails.screenshot_url || taskDetails.recording_url) && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Resources</p>
              <div className="flex flex-wrap gap-2">
                {taskDetails.screenshot_url && (
                  <a
                    href={taskDetails.screenshot_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    View Screenshot
                  </a>
                )}
                {taskDetails.recording_url && (
                  <a
                    href={taskDetails.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    View Recording
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}