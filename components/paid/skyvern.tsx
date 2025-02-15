'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface SkyvernData {
  task_id: string;
  url?: string;
  navigationGoal?: string;
  navigationPayload?: {
    name?: string;
    email?: string;
    additionalInformation?: string;
  };
}

export function Skyvern({ skyvernData }: { skyvernData: SkyvernData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
    >
      <div className="mb-3 px-3 py-2 bg-green-100 dark:bg-green-800/30 rounded border border-green-300 dark:border-green-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-green-800 dark:text-green-200">Task ID:</span>
          <span className="text-sm px-2 py-0.5 rounded bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200">
            {skyvernData.task_id}
          </span>
        </div>
      </div>

      {skyvernData.url && (
        <div className="mb-3 px-3 py-2 bg-green-100 dark:bg-green-800/30 rounded border border-green-300 dark:border-green-700">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">Target URL:</p>
          <a
            href={skyvernData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-600 dark:text-green-300 hover:underline break-all"
          >
            {skyvernData.url}
          </a>
        </div>
      )}

      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-green-800 dark:text-green-200">
            Form Submission Details
          </h3>

          {skyvernData.navigationGoal && (
            <div className="mt-2">
              <p className="text-sm text-green-700 dark:text-green-300">
                <span className="font-medium">Goal:</span> {skyvernData.navigationGoal}
              </p>
            </div>
          )}

          {skyvernData.navigationPayload && (
            <dl className="mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
              {Object.entries(skyvernData.navigationPayload).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <dt className="font-medium capitalize">{key}:</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </motion.div>
  );
}