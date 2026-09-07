"use client";

import React, { useState } from "react";
import {
  STUDIO_TOOLS,
  type StudioTool,
} from "@/lib/tools-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CrownIcon,
  LayersIcon,
  Loader2Icon,
  ScissorsIcon,
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

  // =========================================================================
  // CONCEPT 1: CATEGORY TABS SYSTEM (ACTIVE)
  // =========================================================================
  const CATEGORIES = [
    { id: "background", label: "Background", count: 4, icon: ScissorsIcon },
    { id: "enhance", label: "Enhance", count: 2, icon: SparklesIcon },
    { id: "overlay", label: "Effects", count: 2, icon: LayersIcon },
  ] as const;

  const [activeCategory, setActiveCategory] = useState<"background" | "enhance" | "overlay">(
    (selectedTool.category as any) || "background"
  );

  // Sync category if tool is selected externally
  React.useEffect(() => {
    if (selectedTool?.category && selectedTool.category !== activeCategory) {
      setActiveCategory(selectedTool.category as any);
    }
  }, [selectedToolId]);

  const handleCategoryClick = (catId: "background" | "enhance" | "overlay") => {
    setActiveCategory(catId);
    const toolsInCat = STUDIO_TOOLS.filter((t) => t.category === catId);
    if (!toolsInCat.some((t) => t.id === selectedToolId) && toolsInCat.length > 0) {
      onSelectTool(toolsInCat[0]);
    }
  };

  const filteredTools = STUDIO_TOOLS.filter((t) => t.category === activeCategory);

  /* =========================================================================
   * PREVIOUS VERSION BACKUP: 6-TOOL DEFAULT WITH "VIEW ALL" TOGGLE
   * (Preserved for comparison as requested)
   * -------------------------------------------------------------------------
   * const DEFAULT_VISIBLE_COUNT = 6;
   * const [showAllTools, setShowAllTools] = useState(false);
   * const isSelectedInHidden = STUDIO_TOOLS.slice(DEFAULT_VISIBLE_COUNT).some((t) => t.id === selectedToolId);
   * const isExpanded = showAllTools || isSelectedInHidden;
   * const displayedTools = isExpanded ? STUDIO_TOOLS : STUDIO_TOOLS.slice(0, DEFAULT_VISIBLE_COUNT);
   * =========================================================================
   */

  return (
    <div className="studio-panel flex flex-col gap-6 rounded-[2rem] border border-border/60 p-5 sm:p-7">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-background/35 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
            {isPro ? <CrownIcon className="size-5" /> : <ZapIcon className="size-5" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {isPro ? "Aura Pro Active" : `${usageData?.remaining ?? 3} Free Credits Left`}
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
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Choose AI Tool
          </label>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
            {filteredTools.length} {activeCategory === "background" ? "Background" : activeCategory === "enhance" ? "Enhance" : "Effect"} Tools
          </span>
        </div>

        {/* Concept 1: Category Pills Bar */}
        <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-2xl border border-white/12 bg-white/[0.03] p-1.5 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const CatIcon = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={cn(
                  "relative flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-semibold transition-all duration-200 cursor-pointer",
                  isActive
                    ? "border border-primary/50 bg-gradient-to-r from-primary via-orange-500 to-amber-500 text-white shadow-[0_2px_16px_rgba(255,90,20,0.5),inset_0_1px_0_0_rgba(255,255,255,0.3)] scale-[1.02]"
                    : "border border-transparent text-muted-foreground/80 hover:text-foreground hover:bg-white/[0.06] hover:border-white/10"
                )}
              >
                <CatIcon className="size-3.5 shrink-0" />
                <span>{cat.label}</span>
                <span
                  className={cn(
                    "ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold transition-colors",
                    isActive ? "bg-black/25 text-white" : "bg-white/10 text-muted-foreground"
                  )}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Concept 1: Filtered Category Tools Grid with Frosted Glass Cards */}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2 animate-in fade-in duration-200">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = tool.id === selectedToolId;

            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onSelectTool(tool)}
                className={cn(
                  "group relative flex flex-col items-start gap-2.5 rounded-2xl p-4 text-left transition-all duration-300 cursor-pointer backdrop-blur-xl",
                  isSelected
                    ? "border-2 border-primary bg-gradient-to-b from-primary/20 via-primary/10 to-primary/5 text-foreground shadow-[0_0_30px_rgba(255,100,20,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)] scale-[1.02] ring-1 ring-primary/50"
                    : "border border-white/15 bg-white/[0.04] text-muted-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.25)] hover:border-primary/60 hover:bg-white/[0.08] hover:text-foreground hover:shadow-[0_6px_26px_rgba(255,140,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.18)] hover:-translate-y-1 active:translate-y-0"
                )}
              >
                {tool.badge && (
                  <span
                    className={cn(
                      "absolute right-3 top-3 rounded-md border px-2 py-0.5 text-[10px] font-semibold transition-colors",
                      isSelected
                        ? "bg-primary/25 border-primary/50 text-primary shadow-sm"
                        : "bg-white/10 border-white/15 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary group-hover:bg-primary/15"
                    )}
                  >
                    {tool.badge}
                  </span>
                )}

                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl border transition-all duration-300",
                    isSelected
                      ? "border-primary/70 bg-primary/25 text-primary shadow-[0_0_16px_rgba(255,140,0,0.35)] scale-105"
                      : "border-white/15 bg-white/5 text-foreground/75 group-hover:border-primary/50 group-hover:bg-primary/15 group-hover:text-primary group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(255,140,0,0.25)]"
                  )}
                >
                  <Icon className="size-4.5" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <p
                      className={cn(
                        "text-sm font-semibold tracking-tight transition-colors",
                        isSelected ? "text-white font-bold" : "text-foreground group-hover:text-white"
                      )}
                    >
                      {tool.name}
                    </p>
                    {isSelected && (
                      <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.2)]">
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
                placeholder="e.g., Aura Studio • © 2026"
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
