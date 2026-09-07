"use client";

import React from "react";
import { DownloadIcon, EyeIcon, HistoryIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";

export interface GenerationItem {
  id: string;
  originalImageUrl: string;
  originalFileName?: string | null;
  resultImageUrl: string;
  toolType: string;
  prompt?: string | null;
  createdAt: string | Date;
}

interface HistoryGalleryProps {
  history: GenerationItem[];
  onSelectResult: (originalUrl: string, resultUrl: string, toolType: string) => void;
}

export function HistoryGallery({ history, onSelectResult }: HistoryGalleryProps) {
  if (history.length === 0) {
    return null;
  }

  const handleDownload = (e: React.MouseEvent, item: GenerationItem) => {
    e.stopPropagation();
    saveAs(item.resultImageUrl, `luma-${item.toolType}-${item.id.slice(0, 6)}.png`);
  };

  return (
    <div className="mt-8 rounded-[2rem] border border-border/50 bg-card/30 p-5 backdrop-blur-md sm:p-7">
      <div className="mb-4 flex items-center gap-2">
        <HistoryIcon className="size-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Recent Generations</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {history.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectResult(item.originalImageUrl, item.resultImageUrl, item.toolType)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-background/50 transition-all hover:border-primary hover:shadow-[0_0_20px_rgba(255,180,0,0.15)]"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-black/40">
              <img
                src={item.resultImageUrl}
                alt={item.toolType}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            <div className="p-2.5">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {item.toolType}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleDownload(e, item)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="Download Image"
                >
                  <DownloadIcon className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
