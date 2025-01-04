"use client";

import { motion } from "framer-motion";

interface NewsItem {
  title: string;
  link: string;
  snippet: string;
  date: string;
  source: string;
  imageUrl?: string;
  position?: number;
}

interface NewsProps {
  newsData?: {
    searchParameters?: {
      q: string;
      type: string;
      location: string;
      engine: string;
      gl: string;
    };
    news: NewsItem[];
    credits?: number;
  };
}

export const News = ({ newsData }: NewsProps) => {
  if (!newsData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
              </div>
              <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded flex-shrink-0" />
            </div>
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
            <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {newsData.news.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col gap-3 p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 transition-all duration-200"
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {item.title}
              </a>
            </div>
            {item.imageUrl && (
              <img 
                src={item.imageUrl} 
                alt="" 
                className="w-16 h-16 object-cover rounded flex-shrink-0"
              />
            )}
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {item.snippet}
          </p>
          <div className="flex gap-2 text-xs text-zinc-500 dark:text-zinc-500">
            <span>{item.source}</span>
            <span>•</span>
            <span>{item.date}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
