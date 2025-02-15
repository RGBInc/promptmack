'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface SkyvernTaskDetails {
  task_id: string;
  status: string;
  created_at: string;
  modified_at: string;
  request?: {
    url?: string;
    navigation_goal?: string;
    navigation_payload?: {
      name?: string;
      email?: string;
      additionalInformation?: string;
    };
  };
  extracted_information?: any;
  screenshot_url?: string;
  recording_url?: string;
  action_screenshot_urls?: string[];
  failure_reason?: string;
}

export function Skyvern({ skyvernData }: { skyvernData: { task_id: string } | null }) {
  const [taskDetails, setTaskDetails] = useState<SkyvernTaskDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!skyvernData?.task_id) {
      setError('No task ID provided');
      setLoading(false);
      return;
    }

    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`/api/skyvern/tasks/${skyvernData.task_id}`);
        if (!response.ok) throw new Error('Failed to fetch task details');
        const data = await response.json();
        setTaskDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [skyvernData?.task_id]);


  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
      >
        <div className="flex items-center justify-center py-4">
          <Clock className="h-6 w-6 text-green-500 dark:text-green-400 animate-spin" />
          <span className="ml-2 text-green-700 dark:text-green-300">Loading task details...</span>
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
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
          <span className="text-red-700 dark:text-red-300">{error || 'Failed to load task details'}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-4"
    >
      <div className="flex items-center justify-between px-3 py-2 bg-green-100 dark:bg-green-800/30 rounded border border-green-300 dark:border-green-700">
        <span className="text-sm font-medium text-green-800 dark:text-green-200">Task ID</span>
        <span className="text-sm px-2 py-0.5 rounded bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200">
          {taskDetails.task_id}
        </span>
      </div>

      <div className="px-3 py-2 bg-green-100 dark:bg-green-800/30 rounded border border-green-300 dark:border-green-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-green-800 dark:text-green-200">Status</span>
          <span className="text-sm px-2 py-0.5 rounded bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200">
            {taskDetails.status}
          </span>
        </div>
        <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
          <p>Created: {new Date(taskDetails.created_at).toLocaleString()}</p>
          <p>Last Modified: {new Date(taskDetails.modified_at).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-3">
          <h3 className="font-medium text-green-800 dark:text-green-200">
            Task Details
          </h3>

          {taskDetails.request?.url && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Target URL</p>
              <a
                href={taskDetails.request.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 dark:text-green-300 hover:underline break-all block"
              >
                {taskDetails.request.url}
              </a>
            </div>
          )}

          {taskDetails.request?.navigation_goal && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Navigation Goal</p>
              <p className="text-sm text-green-600 dark:text-green-300">
                {taskDetails.request.navigation_goal}
              </p>
            </div>
          )}

          {taskDetails.request?.navigation_payload && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Form Data</p>
              <dl className="grid gap-2 text-sm text-green-600 dark:text-green-300 bg-green-100/50 dark:bg-green-800/20 rounded-md p-3">
                {Object.entries(taskDetails.request.navigation_payload).map(([key, value]) => (
                  <div key={key} className="flex gap-3">
                    <dt className="font-medium capitalize min-w-[120px]">{key}:</dt>
                    <dd className="flex-1">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {taskDetails.extracted_information && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Extracted Information</p>
              <pre className="text-sm text-green-600 dark:text-green-300 bg-green-100/50 dark:bg-green-800/20 rounded-md p-3 overflow-x-auto">
                {JSON.stringify(taskDetails.extracted_information, null, 2)}
              </pre>
            </div>
          )}

          {taskDetails.failure_reason && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">Failure Reason</p>
              <p className="text-sm text-red-600 dark:text-red-300">
                {taskDetails.failure_reason}
              </p>
            </div>
          )}

          {(taskDetails.screenshot_url || taskDetails.recording_url) && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Resources</p>
              <div className="flex flex-wrap gap-2">
                {taskDetails.screenshot_url && (
                  <a
                    href={taskDetails.screenshot_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 dark:text-green-300 hover:underline"
                  >
                    View Screenshot
                  </a>
                )}
                {taskDetails.recording_url && (
                  <a
                    href={taskDetails.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 dark:text-green-300 hover:underline"
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