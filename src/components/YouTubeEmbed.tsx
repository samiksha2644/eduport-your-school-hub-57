import React, { useState } from "react";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  url: string;
  title?: string;
}

const extractYouTubeId = (url: string): string | null => {
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

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ url, title }) => {
  const [playing, setPlaying] = useState(false);
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
      <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group cursor-pointer"
          >
            <img
              src={thumbnailUrl}
              alt={title || "Video thumbnail"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-primary/90 group-hover:bg-primary flex items-center justify-center transition-colors shadow-lg">
                <Play className="w-6 h-6 text-primary-foreground ml-0.5" fill="currentColor" />
              </div>
            </div>
          </button>
        )}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground hover:text-primary mt-1.5 inline-block transition-colors"
      >
        ↗ Open in YouTube
      </a>
    </div>
  );
};

export default YouTubeEmbed;
