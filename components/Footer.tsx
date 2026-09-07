import Link from "next/link";
import { ArrowUpRightIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FEATURED_STYLES, FOOTER_QUICK_LINKS } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-6 rounded-[2rem] border border-border/60 bg-card px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 border-b border-border/60 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="caps-sm text-sm font-semibold uppercase text-primary">Aura AI Studio</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
              Precision AI Background Removal, Upscaling & Watermarking.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              Transform your visual assets with Aura AI Neural Pipeline. Effortlessly remove backgrounds, replace environments, upscale resolution, and brand images in real time.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="gap-2 rounded-full px-5 py-3">
              <Link href="/playground" prefetch={false}>
                <SparklesIcon className="size-4" />
                Launch Playground
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full border-border/70 px-5 py-3">
              <Link href="#pricing">View Pro Plans</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-8 pt-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-foreground">About Aura Studio</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              A high-performance cloud suite for automated background isolation, scene synthesis, micro-contrast enhancement, and dynamic watermark stamping.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Navigation</p>
            <div className="mt-4 flex flex-col gap-3">
              {FOOTER_QUICK_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Core Capabilities</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {FEATURED_STYLES.map((style) => (
                <span
                  key={style}
                  className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Aura Studio. All rights reserved.</p>
          <p>Powered by Next.js, Prisma, NextAuth & Aura Neural Engine.</p>
        </div>
      </div>
    </footer>
  );
}
