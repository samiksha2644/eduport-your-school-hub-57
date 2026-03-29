import React from "react";
import { Play, ExternalLink } from "lucide-react";

const extractYouTubeId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]+)/,
    /(?:youtu\.be\/)([\w-]+)/,
    /(?:youtube\.com\/embed\/)([\w-]+)/,
    /(?:youtube\.com\/shorts\/)([\w-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const YouTubeEmbed = ({ url, title }) => {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="mt-3">
      {title && (
        <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Play className="w-3.5 h-3.5" />
          {title}
        </h4>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative rounded-lg overflow-hidden border bg-muted aspect-video group"
      >
        <img
          src={thumbnailUrl}
          alt={title || "Video thumbnail"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary/90 group-hover:bg-primary flex items-center justify-center transition-colors shadow-lg">
            <Play className="w-6 h-6 text-primary-foreground ml-0.5" fill="currentColor" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1 text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-3 h-3" /> Open in YouTube
        </div>
      </a>
    </div>
  );
};

export default YouTubeEmbed;
