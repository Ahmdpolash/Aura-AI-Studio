"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { CheckIcon, CrownIcon, Loader2Icon, SparklesIcon, ZapIcon } from "lucide-react";
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
    <section id="pricing" className="section-shell mt-6 px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="caps-sm text-sm font-semibold uppercase text-primary">
            Transparent Pricing
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
            Simple plans for every creator
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Start completely free with 3 AI credits. Upgrade to Pro for unlimited generation power anytime.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Free Tier Card */}
          <div className="flex flex-col justify-between rounded-[2rem] border border-border/60 bg-card/40 p-7 backdrop-blur-xl sm:p-9">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">Starter Free</h3>
                <span className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Free Forever
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Ideal for testing out our AI tools on personal images.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">$0</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>

              <div className="mt-8 space-y-3.5 text-sm text-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span>Max 3 AI image uploads & edits</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span>Standard AI Background Removal</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span>Split-view comparison canvas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span>Standard cloud processing speed</span>
                </div>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              className="studio-pill mt-8 h-12 w-full rounded-full text-sm font-semibold"
            >
              <Link href="/playground">Get Started Free</Link>
            </Button>
          </div>

          {/* Pro Tier Card */}
          <div className="relative flex flex-col justify-between rounded-[2rem] border-2 border-primary bg-card/80 p-7 shadow-[0_0_50px_rgba(255,180,0,0.15)] backdrop-blur-xl sm:p-9">
            <div className="absolute -top-3.5 right-8 rounded-full bg-primary px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-black shadow-md">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
                  <CrownIcon className="size-5 text-primary" /> Luma Pro
                </h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Unconstrained creative production for power users and design teams.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">$19</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>

              <div className="mt-8 space-y-3.5 text-sm text-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-black">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span className="font-semibold text-primary">Unlimited AI uploads & transformations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-black">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span>High-Precision HD Background Removal</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-black">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span>AI Background Replacer with custom prompt</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-black">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span>AI Super-Resolution 2x & 4x Upscaling</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-black">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span>Custom Watermark & Dynamic Typography Overlays</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-black">
                    <CheckIcon className="size-3.5" />
                  </div>
                  <span>Priority GPU cloud pipeline & instant HD downloads</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="studio-primary-action mt-8 h-12 w-full rounded-full text-sm font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" /> Redirecting...
                </>
              ) : (
                <>
                  <ZapIcon className="mr-2 size-4" /> Start Pro Plan ($19/mo)
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
