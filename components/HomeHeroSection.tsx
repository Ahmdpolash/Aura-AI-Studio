"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { ChevronDownIcon, LogInIcon, LogOutIcon, SparklesIcon, Wand2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CENTER_NAV_LINKS, HERO_VIDEO_SRC } from "@/lib/constants";

export function HomeHeroSection() {
  const { data: session, status } = useSession();
  const user = session?.user as any;

  return (
    <section className="home-hero">
      <div className="hero-surface absolute inset-0 z-10" />
      <video
        className="hero-video absolute inset-0 h-full w-full object-cover object-center"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
      <div className="hero-fade pointer-events-none absolute inset-0 z-20" />

      <div className="home-hero-stack">
        <div className="home-nav-border-wrapper">
          <div className="home-nav-beam" />
          <nav className="home-nav">
            <Link href="/" className="home-brand">
              <span className="relative mr-2 flex h-10 w-10 shrink-0 items-center justify-center overflow-visible">
                <Image
                  src="/logo.png"
                  alt="Luma Studio"
                  width={72}
                  height={72}
                  className="h-10 w-10 max-h-none max-w-none origin-left scale-[1.55] object-cover"
                  priority
                />
              </span>
              <div className="min-w-0">
                <span className="caps-2xs block text-sm font-semibold text-foreground">
                  Luma Studio
                </span>
                <span className="caps-xs block truncate text-xs uppercase text-primary">
                  AI Image Studio
                </span>
              </div>
            </Link>

            <div className="home-nav-center">
              {CENTER_NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hero-nav-link inline-flex items-center gap-1"
                >
                  {link.label}
                  {link.hasDropdown ? (
                    <ChevronDownIcon className="home-nav-chevron" aria-hidden />
                  ) : null}
                </Link>
              ))}
            </div>

            <div className="home-nav-auth">
              {status === "authenticated" && user ? (
                <div className="flex items-center gap-3">
                  <Button variant="outline" asChild className="home-btn-studio-outline">
                    <Link href="/playground" prefetch={false}>
                      Playground
                    </Link>
                  </Button>
                  {user.image && (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="size-8 rounded-full border border-border/60 object-cover"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="size-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                    title="Sign Out"
                  >
                    <LogOutIcon className="size-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => signIn("google")}
                    className="home-btn-signin"
                  >
                    <LogInIcon className="mr-1.5 size-3.5" /> Sign In
                  </Button>
                  <Button asChild className="home-btn-nav-primary">
                    <Link href="/playground">Launch Studio</Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="home-hero-copy">
          <h1 className="hero-title home-hero-title">
            <span className="block">Next-Gen AI Image Studio.</span>
            <span className="home-hero-tagline">
              Remove Backgrounds, Replace Scenes & Upscale in Real-time.
            </span>
          </h1>

          <p className="home-hero-lede">
            Professional AI image editing powered by Luma Neural Vision Engine. Isolate subjects, generate custom AI environments, enhance micro-details 2x, and stamp dynamic watermarks.
          </p>

          <div className="mt-9 flex w-full max-w-md flex-col items-center justify-center gap-4 sm:max-w-none sm:flex-row">
            <Link
              href="/playground"
              prefetch={false}
              className="group inline-flex h-13 sm:h-14 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-500 px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_28px_rgba(255,90,20,0.4)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_8px_38px_rgba(255,90,20,0.65)] active:scale-[0.98] cursor-pointer"
            >
              <Wand2Icon className="size-5 transition-transform duration-300 group-hover:rotate-12" />
              <span>Open AI Playground</span>
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex h-13 sm:h-14 items-center justify-center rounded-full border border-border/80 bg-card/40 px-8 py-3.5 text-base font-medium text-foreground/90 backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-[1.04] hover:border-primary/50 hover:bg-card/80 hover:text-foreground hover:shadow-[0_0_25px_rgba(255,180,0,0.18)] active:scale-[0.98] cursor-pointer"
            >
              See How It Works
            </a>
          </div>
        </div>

        <div className="home-demo-wrap">
          <div className="home-demo-shift">
            <div className="hero-demo-glass home-demo-glass-shell">
              <div className="hero-demo-glass-inner home-demo-inner">
                <Image
                  src="/demo-home.png"
                  alt="Luma Studio workspace showing upload, AI tools, and interactive canvas comparison"
                  width={3290}
                  height={1872}
                  className="h-auto w-full"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
