"use client";

import React from "react";

interface VideoItem {
  title: string;
  link: string;
  snippet: string;
  imageUrl: string;
  duration: string;
  source: string;
  channel: string;
  date: string;
  position: number;
}

interface VideosProps {
  videosData?: {
    searchParameters?: {
      q: string;
      type: string;
      engine: string;
    };
    videos: VideoItem[];
  };
}

export const Videos = ({ videosData }: VideosProps) => {
  if (!videosData) {
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
      {videosData.videos.map((video, index) => (
        <a
          key={index}
          href={video.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-3 p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 transition-all duration-200"
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-sm line-clamp-2 text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{video.title}</h3>
            </div>
            {video.imageUrl && (
              <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded">
                <img
                  src={video.imageUrl}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1 rounded">
                  {video.duration}
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {video.snippet}
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
            <span>{video.channel}</span>
            <span>•</span>
            <span>{video.date}</span>
          </div>
        </a>
      ))}
    </div>
  );
};
