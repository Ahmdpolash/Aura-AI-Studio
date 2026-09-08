"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRightIcon, CheckIcon, CrownIcon, Loader2Icon, SparklesIcon, ZapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!session?.user) {
      signIn("google");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate Stripe checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert(err?.message || "Something went wrong.");
      setIsLoading(false);
    }
  };

  return (
    <section id="pricing" className="section-shell relative mt-6 overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/10 blur-[120px] -z-10" />

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
            <SparklesIcon className="size-3.5 text-primary" />
            <span className="uppercase tracking-widest text-[11px]">Transparent Pricing</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            Simple plans for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
              every creator.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
            Start completely free with 3 AI credits. Upgrade to Pro for unlimited generation power anytime.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Free Tier Card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col justify-between rounded-[2rem] border border-white/10 bg-card/40 p-7 sm:p-9 backdrop-blur-2xl transition-colors duration-300 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* Top specular edge highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">Starter Free</h3>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Free Forever
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Ideal for testing out our AI tools on personal images.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-white">$0</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>

              <div className="mt-8 space-y-3.5 text-sm text-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/20">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span>Max 3 AI image uploads & edits</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/20">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span>Standard AI Background Removal</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/20">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span>Split-view comparison canvas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/20">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span>Standard cloud processing speed</span>
                </div>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              className="mt-8 h-12 w-full rounded-full border border-white/20 bg-white/[0.04] text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.1] hover:border-white/40 cursor-pointer"
            >
              <Link href="/playground">Get Started Free</Link>
            </Button>
          </motion.div>

          {/* Pro Tier Card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col justify-between rounded-[2rem] border border-primary/50 bg-card/85 p-7 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_50px_rgba(255,90,20,0.25)] backdrop-blur-2xl transition-colors duration-300 hover:border-primary hover:shadow-[0_30px_80px_rgba(0,0,0,0.95),0_0_70px_rgba(255,90,20,0.38)]"
          >
            {/* Top specular golden line */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none" />

            {/* Ambient warm corner glow */}
            <div className="absolute -top-14 -right-14 size-44 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

            {/* Most Popular Tag */}
            <div className="absolute -top-3.5 right-6 sm:right-8 z-20 inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-400 via-orange-500 to-primary px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(255,180,0,0.55)]">
              <SparklesIcon className="size-3 fill-black text-black" />
              <span>Most Popular</span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary/20 border border-primary/30 text-primary">
                    <CrownIcon className="size-4" />
                  </div>
                  <span>Aura Pro</span>
                </h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Unconstrained creative production for power users and design teams.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-white">$19</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>

              <div className="mt-8 space-y-3.5 text-sm text-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-black shadow-sm">
                    <CheckIcon className="size-3.5 stroke-[2.5]" />
                  </div>
                  <span className="font-semibold text-primary">Unlimited AI uploads & transformations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-black shadow-sm">
                    <CheckIcon className="size-3.5 stroke-[2.5]" />
                  </div>
                  <span>High-Precision HD Background Removal</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-black shadow-sm">
                    <CheckIcon className="size-3.5 stroke-[2.5]" />
                  </div>
                  <span>AI Background Replacer with custom prompt</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-black shadow-sm">
                    <CheckIcon className="size-3.5 stroke-[2.5]" />
                  </div>
                  <span>AI Super-Resolution 2x & 4x Upscaling</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-black shadow-sm">
                    <CheckIcon className="size-3.5 stroke-[2.5]" />
                  </div>
                  <span>Custom Watermark & Dynamic Typography Overlays</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-black shadow-sm">
                    <CheckIcon className="size-3.5 stroke-[2.5]" />
                  </div>
                  <span>Priority GPU cloud pipeline & instant HD downloads</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="mt-8 h-12 w-full rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-500 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(255,90,20,0.45)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(255,90,20,0.7)] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" /> Redirecting...
                </>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <ZapIcon className="size-4 fill-white" />
                  <span>Start Pro Plan ($19/mo)</span>
                  <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
