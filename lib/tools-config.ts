import {
  CropIcon,
  ExpandIcon,
  LayersIcon,
  Maximize2Icon,
  PaletteIcon,
  ScissorsIcon,
  SparklesIcon,
  TypeIcon,
  Wand2Icon,
  ZapIcon,
} from "lucide-react";

export interface StudioTool {
  id: string;
  name: string;
  category: "background" | "enhance" | "overlay";
  description: string;
  icon: any;
  transform: string;
  requiresPrompt?: boolean;
  promptPlaceholder?: string;
  quickPrompts?: string[];
  requiresTextWatermark?: boolean;
  badge?: string;
}

export const STUDIO_TOOLS: StudioTool[] = [
  {
    id: "bg-remove",
    name: "Remove Background",
    category: "background",
    description: "Instant AI background removal with crisp subject edge detection.",
    icon: ScissorsIcon,
    transform: "e-bgremove",
    badge: "Popular",
  },
  {
    id: "bg-remove-pro",
    name: "HD Background Remover",
    category: "background",
    description: "High-precision background removal optimized for hair and fine details.",
    icon: Wand2Icon,
    transform: "e-removedotbg",
    badge: "Pro Quality",
  },
  {
    id: "change-bg",
    name: "Change Background",
    category: "background",
    description: "Replace your background with realistic AI-generated environments.",
    icon: ExpandIcon,
    transform: "e-changebg",
    requiresPrompt: true,
    promptPlaceholder: "e.g., luxury modern minimalist studio with soft warm lighting",
    quickPrompts: [
      "luxury minimalist photography studio with soft shadows",
      "tropical beach with palm trees at golden hour sunset",
      "cyberpunk neon Tokyo alley with reflective wet ground",
      "modern high-end living room with Scandinavian interior",
      "clean aesthetic pastel aesthetic backdrop",
    ],
    badge: "AI Gen",
  },
  {
    id: "upscale",
    name: "AI Super Upscale 2x",
    category: "enhance",
    description: "Upscale resolution and reconstruct high-frequency texture details.",
    icon: Maximize2Icon,
    transform: "e-upscale",
    badge: "2x HD",
  },
  {
    id: "retouch",
    name: "AI Retouch & Enhance",
    category: "enhance",
    description: "Auto-enhance lighting, color balance, vibrancy, and micro-contrast.",
    icon: SparklesIcon,
    transform: "e-retouch",
  },
  {
    id: "dropshadow",
    name: "Realistic Drop Shadow",
    category: "overlay",
    description: "Generate natural dynamic 3D shadow under isolated subjects.",
    icon: LayersIcon,
    transform: "e-dropshadow",
  },
  {
    id: "text-watermark",
    name: "Watermark & Text Overlay",
    category: "overlay",
    description: "Stamp customized typography, brand names, or copyrights.",
    icon: TypeIcon,
    transform: "text-overlay",
    requiresTextWatermark: true,
  },
  {
    id: "genfill",
    name: "Generative Fill",
    category: "background",
    description: "Expand image canvas and fill boundaries with contextual AI imagery.",
    icon: PaletteIcon,
    transform: "bg-genfill",
    requiresPrompt: true,
    promptPlaceholder: "e.g., extend background with lush green botanical plants",
    quickPrompts: [
      "extend background with soft studio bokeh lighting",
      "fill with subtle clean architectural concrete textures",
      "surround with atmospheric fog and warm ambient light",
    ],
  },
];
