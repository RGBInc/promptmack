import { motion } from "framer-motion";

interface SimilarResult {
  score: number;
  title: string;
  id: string;
  url: string;
  publishedDate: string;
  author: string | null;
  summary: string;
  image?: string;
  favicon?: string;
  highlights: string[];
  highlightScores: number[];
}

interface SimilarProps {
  similarData?: {
    results: SimilarResult[];
    requestId: string;
  };
}

export const Similar = ({ similarData }: SimilarProps) => {
  if (!similarData) {
    return (
      <div className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <div className="flex flex-col gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
              <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
    >
      <div className="flex flex-col gap-6">
        {similarData.results.map((result, index) => (
          <a
            key={index}
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-3 p-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              {result.favicon && (
                <img
                  src={result.favicon}
                  alt=""
                  className="w-6 h-6 rounded-sm flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-base mb-1 break-words">{result.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 break-all">
                  {result.url}
                </p>
              </div>
              <div className="flex-shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
                Score: {Math.round(result.score * 100)}%
              </div>
            </div>
            
            <p className="text-sm text-zinc-700 dark:text-zinc-300 break-words">
              {result.summary}
            </p>

            {result.highlights.length > 0 && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 p-3 rounded">
                <p className="italic break-words">{result.highlights[0]}</p>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
              {result.publishedDate && (
                <span>
                  Published: {new Date(result.publishedDate).toLocaleDateString()}
                </span>
              )}
              {result.author && (
                <>
                  <span>•</span>
                  <span>By: {result.author}</span>
                </>
              )}
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
};
