"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  DownloadIcon,
  ImageIcon,
  Loader2Icon,
  RefreshCwIcon,
  Share2Icon,
  SplitIcon,
  UploadCloudIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";

interface CanvasViewerProps {
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  isUploading?: boolean;
  uploadingFileName?: string | null;
  activeToolName?: string;
  onUploadClick: () => void;
  onSampleSelect?: (sampleUrl: string) => void;
}

const SAMPLE_IMAGES = [
  {
    name: "Business Portrait",
    url: "https://ik.imagekit.io/oi8yikpgd/luma-studio-uploads/enhance-two_DtWhr0ifhK.png",
  },
];

export function CanvasViewer({
  originalImage,
  processedImage,
  isProcessing,
  isUploading = false,
  uploadingFileName,
  activeToolName,
  onUploadClick,
  onSampleSelect,
}: CanvasViewerProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isSplitView, setIsSplitView] = useState(true);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleDownload = () => {
    const targetUrl = processedImage || originalImage;
    if (!targetUrl) return;
    const filename = `luma-ai-${activeToolName ? activeToolName.toLowerCase().replace(/\s+/g, "-") : "edit"}-${Date.now()}.png`;
    saveAs(targetUrl, filename);
  };

  const handleCopyLink = () => {
    const targetUrl = processedImage || originalImage;
    if (!targetUrl) return;
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!originalImage) {
    if (isUploading) {
      return (
        <div className="studio-panel-inset relative flex min-h-[540px] flex-col items-center justify-center overflow-hidden rounded-[2.2rem] border border-primary/40 bg-card/40 p-8 text-center sm:p-12 backdrop-blur-md">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -top-24 size-72 rounded-full bg-primary/15 blur-3xl animate-pulse" />

          {/* Animated Spinner & Upload Icon */}
          <div className="relative mx-auto mb-6 flex size-24 items-center justify-center rounded-3xl border border-primary/40 bg-primary/15 text-primary shadow-[0_0_50px_rgba(255,180,0,0.3)]">
            <Loader2Icon className="size-12 animate-spin text-primary" />
            <UploadCloudIcon className="absolute size-6 text-primary animate-pulse" />
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <span className="size-2 rounded-full bg-primary animate-ping" />
            Uploading to ImageKit Secure CDN
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Uploading Your Image...
          </h3>

          {uploadingFileName && (
            <p className="mt-3 max-w-sm truncate rounded-xl border border-border/60 bg-background/50 px-4 py-1.5 text-xs font-medium text-foreground">
              📄 {uploadingFileName}
            </p>
          )}

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Synchronizing and preparing high-resolution image for AI tools. Please wait a moment...
          </p>

          {/* Animated Loading Bar */}
          <div className="mt-7 w-full max-w-xs overflow-hidden rounded-full bg-border/40 p-0.5">
            <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
          </div>
        </div>
      );
    }

    return (
      <div className="studio-panel-inset relative flex min-h-[540px] flex-col items-center justify-center rounded-[2.2rem] border border-dashed border-border/70 p-8 text-center sm:p-12">
        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-3xl border border-primary/25 bg-primary/10 text-primary shadow-[0_0_35px_rgba(255,180,0,0.15)]">
          <UploadCloudIcon className="size-10 animate-pulse" />
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Canvas Ready for Magic
        </h3>
        <p className="mx-auto mt-2 max-w-md text-base text-muted-foreground">
          Upload a high-resolution photo to remove backgrounds, replace scenes, upscale details, or overlay watermarks.
        </p>

        <Button
          onClick={onUploadClick}
          className="studio-primary-action mt-6 rounded-full px-8 py-6 text-base font-semibold"
        >
          <ImageIcon className="mr-2 size-5" /> Select Image from Device
        </Button>

        {onSampleSelect && (
          <div className="mt-10 w-full max-w-md border-t border-border/40 pt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Or test with sample image
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => onSampleSelect(sample.url)}
                  className="rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const activeImage = processedImage || originalImage;

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/40 bg-card/40 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {processedImage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSplitView(!isSplitView)}
              className="studio-pill rounded-full text-xs font-medium"
            >
              <SplitIcon className="mr-1.5 size-3.5" />
              {isSplitView ? "Split Slider On" : "Show Result Only"}
            </Button>
          )}

          {activeToolName && (
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              ⚡ {activeToolName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="studio-pill rounded-full text-xs"
          >
            <Share2Icon className="mr-1.5 size-3.5" />
            {copied ? "Copied!" : "Copy Link"}
          </Button>

          <Button
            size="sm"
            onClick={handleDownload}
            disabled={isProcessing}
            className="studio-primary-action rounded-full px-4 text-xs font-semibold"
          >
            <DownloadIcon className="mr-1.5 size-3.5" />
            Download HD
          </Button>
        </div>
      </div>

      {/* Main Interactive Canvas Area with Transparency Checkered Background */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="transparency-checkered relative aspect-[4/3] w-full select-none overflow-hidden rounded-[2rem] border border-border/70 shadow-2xl"
      >
        {/* Uploading Glass Overlay */}
        {isUploading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/75 p-6 backdrop-blur-md">
            <div className="relative flex size-20 items-center justify-center rounded-3xl border border-primary/40 bg-primary/15 text-primary shadow-[0_0_50px_rgba(255,180,0,0.35)]">
              <Loader2Icon className="size-10 animate-spin text-primary" />
              <UploadCloudIcon className="absolute size-5 text-primary/80 animate-pulse" />
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <span className="size-2 rounded-full bg-primary animate-ping" />
              Uploading to Cloud CDN
            </div>
            <p className="mt-2 max-w-xs truncate text-base font-bold text-foreground">
              {uploadingFileName || "Uploading Image..."}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Optimizing high-res pixels for AI pipeline...
            </p>
          </div>
        )}

        {/* Processing Glass Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 p-6 backdrop-blur-md">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 text-primary shadow-[0_0_40px_rgba(255,180,0,0.3)]">
              <Loader2Icon className="size-8 animate-spin" />
            </div>
            <p className="mt-4 text-lg font-semibold text-foreground">
              Transforming with ImageKit AI...
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Processing in cloud pipeline. Results will appear automatically.
            </p>
          </div>
        )}

        {/* Split View Slider Mode */}
        {isSplitView && processedImage ? (
          <div className="relative h-full w-full">
            {/* Original Image Layer (Left: clipped to sliderPosition) */}
            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden p-2"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={originalImage}
                alt="Original source"
                className="max-h-full max-w-full rounded-2xl object-contain"
              />
              <span className="absolute bottom-4 left-4 z-10 rounded-md bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                Original
              </span>
            </div>

            {/* Transformed Image Layer (Right: clipped from 0 to sliderPosition) */}
            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden p-2"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <img
                src={processedImage}
                alt="AI Processed Result"
                className="max-h-full max-w-full rounded-2xl object-contain"
              />
              <span className="absolute bottom-4 right-4 z-10 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-black shadow-md">
                AI Enhanced
              </span>
            </div>

            {/* Draggable Divider Line and Knob */}
            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              className="absolute bottom-0 top-0 z-20 w-1 cursor-ew-resize bg-primary shadow-[0_0_15px_rgba(255,180,0,0.8)]"
              style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
            >
              <div className="absolute top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/40 bg-primary text-black shadow-lg">
                <SplitIcon className="size-4" />
              </div>
            </div>
          </div>
        ) : (
          /* Single View Mode */
          <div className="relative flex h-full w-full items-center justify-center p-2">
            <img
              src={activeImage}
              alt="Active preview"
              className="max-h-full max-w-full rounded-2xl object-contain"
            />
          </div>
        )}
      </div>

      {/* Canvas Footnote */}
      <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
        <span>Drag center slider horizontally to compare before/after details</span>
        <button
          onClick={onUploadClick}
          className="flex items-center gap-1 font-medium text-primary hover:underline"
        >
          <RefreshCwIcon className="size-3" /> Change image
        </button>
      </div>
    </div>
  );
}
