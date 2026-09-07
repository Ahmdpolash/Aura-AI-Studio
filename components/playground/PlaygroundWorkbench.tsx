"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { upload } from "@imagekit/next";
import { CanvasViewer } from "./CanvasViewer";
import { ToolControls } from "./ToolControls";
import { HistoryGallery, type GenerationItem } from "./HistoryGallery";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import {
  STUDIO_TOOLS,
  type StudioTool,
} from "@/lib/tools-config";
import {
  buildTransformedImageUrl,
  getToolTransformation,
  type TransformToolId,
} from "@/lib/imagekit";
import { CheckCircleIcon, SparklesIcon } from "lucide-react";

export function PlaygroundWorkbench() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const [selectedTool, setSelectedTool] = useState<StudioTool>(STUDIO_TOOLS[0]);
  const [prompt, setPrompt] = useState("");
  const [watermarkText, setWatermarkText] = useState("Luma AI Studio");
  const [watermarkFontSize, setWatermarkFontSize] = useState(32);
  const [watermarkColor, setWatermarkColor] = useState("#FFFFFF");

  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeSuccessBanner, setUpgradeSuccessBanner] = useState(false);

  const [usageData, setUsageData] = useState<{
    usageCount: number;
    usageLimit: number;
    plan: string;
    canUpload: boolean;
    remaining: number;
  } | null>(null);

  const [history, setHistory] = useState<GenerationItem[]>([]);

  // Fetch usage stats & generation history
  const fetchUsageAndHistory = async () => {
    try {
      const [usageRes, historyRes] = await Promise.all([
        fetch("/api/usage"),
        fetch("/api/generations"),
      ]);

      if (usageRes.ok) {
        const uData = await usageRes.json();
        setUsageData(uData);
      }

      if (historyRes.ok) {
        const hData = await historyRes.json();
        setHistory(hData.generations || []);
      }
    } catch (err) {
      console.error("Failed to load initial studio data:", err);
    }
  };

  // Verify checkout session on redirect from Stripe
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const isUpgraded = searchParams.get("upgraded");

    if (sessionId || isUpgraded) {
      const verifySession = async () => {
        try {
          if (sessionId) {
            await fetch(`/api/verify-checkout-session?session_id=${sessionId}`);
          }
          setUpgradeSuccessBanner(true);
          await fetchUsageAndHistory();
          // Clean up URL
          router.replace("/playground");
        } catch (err) {
          console.error("Error verifying checkout session:", err);
        }
      };

      verifySession();
    }
  }, [searchParams]);

  useEffect(() => {
    if (session?.user) {
      fetchUsageAndHistory();
    }
  }, [session]);

  const handleFileUpload = async (file: File) => {
    if (!session?.user) {
      signIn("google");
      return;
    }

    // Check if free quota exceeded
    const isPro = usageData?.plan === "PRO";
    if (usageData && !usageData.canUpload && !isPro) {
      setIsUpgradeModalOpen(true);
      return;
    }

    try {
      setIsProcessing(true);

      const authRes = await fetch("/api/upload-auth");
      if (!authRes.ok) throw new Error("Failed to get upload authorization");
      const authData = await authRes.json();

      const uploadResult = await upload({
        file,
        fileName: file.name,
        folder: "luma-studio-uploads",
        token: authData.token,
        expire: authData.expire,
        signature: authData.signature,
        publicKey: authData.publicKey,
      });

      if (uploadResult?.url) {
        setOriginalImage(uploadResult.url);
        setOriginalFileName(file.name);
        setProcessedImage(null);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyTransform = async () => {
    if (!originalImage) return;

    if (!session?.user) {
      signIn("google");
      return;
    }

    // Check quota limit
    const isPro = usageData?.plan === "PRO";
    if (usageData && !usageData.canUpload && !isPro) {
      setIsUpgradeModalOpen(true);
      return;
    }

    try {
      setIsProcessing(true);

      const transformStr = getToolTransformation(selectedTool.id as TransformToolId, {
        prompt,
        watermarkText,
        fontSize: watermarkFontSize,
        fontColor: watermarkColor,
      });

      const transformedUrl = buildTransformedImageUrl(originalImage, [transformStr]);

      // Poll ImageKit URL until ready
      let isReady = false;
      let attempts = 0;
      const maxAttempts = 30;

      while (!isReady && attempts < maxAttempts) {
        attempts++;
        try {
          const checkRes = await fetch(transformedUrl, {
            method: "HEAD",
            cache: "no-cache",
          });
          if (checkRes.ok) {
            isReady = true;
            break;
          }
        } catch {
          // Retry
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      setProcessedImage(transformedUrl);

      // Increment usage count and persist generation record
      await fetch("/api/usage", { method: "POST" });
      await fetch("/api/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalImageUrl: originalImage,
          originalFileName,
          resultImageUrl: transformedUrl,
          toolType: selectedTool.name,
          prompt: prompt || null,
        }),
      });

      // Refresh counters and history
      await fetchUsageAndHistory();
    } catch (err) {
      console.error("AI Transformation error:", err);
      alert("Transformation error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectHistory = (origUrl: string, resUrl: string, toolType: string) => {
    setOriginalImage(origUrl);
    setProcessedImage(resUrl);
    const matched = STUDIO_TOOLS.find((t) => t.name === toolType);
    if (matched) setSelectedTool(matched);
  };

  return (
    <div className="w-full">
      {/* Upgrade Success Notification Banner */}
      {upgradeSuccessBanner && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-primary/40 bg-primary/10 p-4 text-foreground shadow-[0_0_30px_rgba(255,180,0,0.15)] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-black">
              <CheckCircleIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                🎉 Welcome to Luma Pro!
              </p>
              <p className="text-xs text-muted-foreground">
                Your subscription is active. You now have unlimited high-resolution AI transformations.
              </p>
            </div>
          </div>
          <button
            onClick={() => setUpgradeSuccessBanner(false)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFileUpload(f);
        }}
      />

      {/* Main Grid Workbench */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:gap-8">
        {/* Left: Canvas Viewer with Before/After Slider */}
        <CanvasViewer
          originalImage={originalImage}
          processedImage={processedImage}
          isProcessing={isProcessing}
          activeToolName={selectedTool.name}
          onUploadClick={() => fileInputRef.current?.click()}
          onSampleSelect={(url) => {
            setOriginalImage(url);
            setProcessedImage(null);
          }}
        />

        {/* Right: AI Tools & Parameters Controls */}
        <ToolControls
          selectedToolId={selectedTool.id}
          onSelectTool={setSelectedTool}
          prompt={prompt}
          onPromptChange={setPrompt}
          watermarkText={watermarkText}
          onWatermarkTextChange={setWatermarkText}
          watermarkFontSize={watermarkFontSize}
          onWatermarkFontSizeChange={setWatermarkFontSize}
          watermarkColor={watermarkColor}
          onWatermarkColorChange={setWatermarkColor}
          onApplyTransform={handleApplyTransform}
          isProcessing={isProcessing}
          canApply={Boolean(originalImage)}
          usageData={usageData}
          onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
        />
      </div>

      {/* History Gallery */}
      <HistoryGallery history={history} onSelectResult={handleSelectHistory} />

      {/* Pro Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}
