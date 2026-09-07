"use client";

import React, { useState } from "react";
import {
  STUDIO_TOOLS,
  type StudioTool,
} from "@/lib/tools-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CrownIcon,
  Loader2Icon,
  SparklesIcon,
  Wand2Icon,
  ZapIcon,
} from "lucide-react";

interface ToolControlsProps {
  selectedToolId: string;
  onSelectTool: (tool: StudioTool) => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  watermarkText: string;
  onWatermarkTextChange: (text: string) => void;
  watermarkFontSize: number;
  onWatermarkFontSizeChange: (size: number) => void;
  watermarkColor: string;
  onWatermarkColorChange: (color: string) => void;
  watermarkPosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";
  onWatermarkPositionChange?: (pos: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center") => void;
  watermarkBadge?: boolean;
  onWatermarkBadgeChange?: (badge: boolean) => void;
  onApplyTransform: () => void;
  isProcessing: boolean;
  canApply: boolean;
  isPro?: boolean;
  usageData: {
    usageCount: number;
    usageLimit: number;
    plan: string;
    canUpload: boolean;
    remaining: number;
  } | null;
  onOpenUpgradeModal: () => void;
}

const WATERMARK_COLORS = [
  { label: "White", value: "#FFFFFF" },
  { label: "Gold", value: "#FFB800" },
  { label: "Cyan", value: "#00F5D4" },
  { label: "Black", value: "#000000" },
  { label: "Crimson", value: "#FF0055" },
];

const WATERMARK_POSITIONS = [
  { id: "bottom-right", label: "Bottom Right" },
  { id: "bottom-left", label: "Bottom Left" },
  { id: "top-right", label: "Top Right" },
  { id: "top-left", label: "Top Left" },
  { id: "center", label: "Center" },
] as const;

export function ToolControls({
  selectedToolId,
  onSelectTool,
  prompt,
  onPromptChange,
  watermarkText,
  onWatermarkTextChange,
  watermarkFontSize,
  onWatermarkFontSizeChange,
  watermarkColor,
  onWatermarkColorChange,
  watermarkPosition = "bottom-right",
  onWatermarkPositionChange,
  watermarkBadge = true,
  onWatermarkBadgeChange,
  onApplyTransform,
  isProcessing,
  canApply,
  isPro: isProProp,
  usageData,
  onOpenUpgradeModal,
}: ToolControlsProps) {
  const selectedTool = STUDIO_TOOLS.find((t) => t.id === selectedToolId) || STUDIO_TOOLS[0];
  const isPro = Boolean(isProProp || usageData?.plan === "PRO");

  return (
    <div className="studio-panel flex flex-col gap-6 rounded-[2rem] border border-border/60 p-5 sm:p-7">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-background/35 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
            {isPro ? <CrownIcon className="size-5" /> : <ZapIcon className="size-5" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {isPro ? "Luma Pro Active" : `${usageData?.remaining ?? 3} Free Credits Left`}
            </p>
            <p className="text-xs text-muted-foreground">
              {isPro
                ? "Unlimited AI transformations enabled"
                : `${usageData?.usageCount ?? 0} of ${usageData?.usageLimit ?? 3} free edits used`}
            </p>
          </div>
        </div>

        {!isPro && (
          <Button
            size="sm"
            onClick={onOpenUpgradeModal}
            className="studio-primary-action h-8 rounded-full px-4 text-xs font-semibold cursor-pointer"
          >
            Upgrade to Pro
          </Button>
        )}
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          1. Choose AI Tool
        </label>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-2">
          {STUDIO_TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isSelected = tool.id === selectedToolId;

            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onSelectTool(tool)}
                className={cn(
                  "group relative flex flex-col items-start gap-2 rounded-2xl border p-3.5 text-left transition-all cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground shadow-[0_0_20px_rgba(255,180,0,0.15)]"
                    : "border-border/50 bg-card/40 text-muted-foreground hover:border-border hover:bg-card/70 hover:text-foreground"
                )}
              >
                {tool.badge && (
                  <span className="absolute right-2.5 top-2.5 rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {tool.badge}
                  </span>
                )}

                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-xl border transition-colors",
                    isSelected
                      ? "border-primary/50 bg-primary/20 text-primary"
                      : "border-border/50 bg-background/40 text-muted-foreground group-hover:text-primary"
                  )}
                >
                  <Icon className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">{tool.name}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border/40 bg-background/25 p-4">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">
            {selectedTool.name} Options
          </h4>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{selectedTool.description}</p>

        {selectedTool.requiresPrompt && (
          <div className="mt-4 space-y-3">
            <label className="text-xs font-medium text-foreground">
              Describe your desired background scene
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder={selectedTool.promptPlaceholder || "Enter scene description..."}
              className="w-full rounded-xl border border-border/60 bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />

            {selectedTool.quickPrompts && (
              <div>
                <p className="mb-1.5 text-[11px] text-muted-foreground">Quick inspiration:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTool.quickPrompts.map((quick) => (
                    <button
                      key={quick}
                      type="button"
                      onClick={() => onPromptChange(quick)}
                      className="cursor-pointer rounded-lg border border-border/50 bg-card/50 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                    >
                      {quick}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTool.requiresTextWatermark && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground">Overlay Text</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => onWatermarkTextChange(e.target.value)}
                placeholder="e.g., Luma Studio • © 2026"
                className="mt-1 w-full rounded-xl border border-border/60 bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Font Size</span>
                <span className="tabular-nums text-muted-foreground">{watermarkFontSize}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="64"
                value={watermarkFontSize}
                onChange={(e) => onWatermarkFontSizeChange(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
            </div>

              <div>
                <label className="text-xs font-medium text-foreground">Color</label>
                <div className="mt-2 flex items-center gap-2">
                  {WATERMARK_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => onWatermarkColorChange(color.value)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all cursor-pointer",
                        watermarkColor === color.value
                          ? "border-primary bg-primary/20 text-foreground"
                          : "border-border/60 bg-card/60 text-muted-foreground hover:border-border"
                      )}
                    >
                      <span
                        className="size-2.5 rounded-full border border-black/30"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Watermark Position</label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {WATERMARK_POSITIONS.map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => onWatermarkPositionChange?.(pos.id)}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-xs font-medium transition-all text-center cursor-pointer",
                        watermarkPosition === pos.id
                          ? "border-primary bg-primary/20 text-foreground font-semibold shadow-sm"
                          : "border-border/60 bg-card/60 text-muted-foreground hover:border-border hover:text-foreground"
                      )}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-3">
                <div>
                  <p className="text-xs font-semibold text-foreground">Glass Badge Background</p>
                  <p className="text-[11px] text-muted-foreground">Dark semi-transparent pill behind text</p>
                </div>
                <button
                  type="button"
                  onClick={() => onWatermarkBadgeChange?.(!watermarkBadge)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    watermarkBadge ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block size-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out",
                      watermarkBadge ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>
          )}
      </div>

      <Button
        onClick={onApplyTransform}
        disabled={!canApply || isProcessing}
        className="studio-primary-action h-14 w-full rounded-full text-base font-semibold shadow-lg cursor-pointer disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2Icon className="mr-2 size-5 animate-spin" /> Processing AI Transformation...
          </>
        ) : (
          <>
            <Wand2Icon className="mr-2 size-5" /> Apply {selectedTool.name}
          </>
        )}
      </Button>
    </div>
  );
}
