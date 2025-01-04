"use client";

import { motion } from "framer-motion";

interface ScholarItem {
  title: string;
  link: string;
  publicationInfo: string;
  snippet: string;
  year: number;
  citedBy: number;
  id: string;
  pdfUrl?: string;
  htmlUrl?: string;
}

interface ScholarProps {
  scholarData?: {
    searchParameters?: {
      q: string;
      type: string;
      engine: string;
    };
    organic: ScholarItem[];
    credits?: number;
  };
}

export const Scholar = ({ scholarData }: ScholarProps) => {
  if (!scholarData) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
            <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {scholarData.organic.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 transition-all duration-200"
        >
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-base text-blue-600 dark:text-blue-400 hover:underline"
          >
            {item.title}
          </a>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {item.publicationInfo}
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {item.snippet}
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
            <span>Year: {item.year}</span>
            <span>•</span>
            <span>Cited by: {item.citedBy}</span>
            {item.pdfUrl && (
              <>
                <span>•</span>
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  PDF
                </a>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
