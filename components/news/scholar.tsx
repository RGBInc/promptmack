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
        {scholarData.organic.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-3 p-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 transition-colors"
          >
            <h3 className="font-medium text-base">{item.title}</h3>
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    PDF
                  </a>
                </>
              )}
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
};
