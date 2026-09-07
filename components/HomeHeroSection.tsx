"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ChevronDownIcon,
  CrownIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  SparklesIcon,
  Wand2Icon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CENTER_NAV_LINKS, HERO_VIDEO_SRC } from "@/lib/constants";

function SeamlessHeroBackground() {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const isTransitioningRef = useRef(false);

  const checkTransition = (
    currentVideo: HTMLVideoElement,
    otherVideo: HTMLVideoElement,
    nextActive: 1 | 2
  ) => {
    if (!currentVideo || !otherVideo) return;
    const timeLeft = currentVideo.duration - currentVideo.currentTime;
    if (timeLeft <= 1.2 && !isTransitioningRef.current && currentVideo.duration > 2) {
      isTransitioningRef.current = true;
      otherVideo.currentTime = 0;
      otherVideo.play().catch(() => {});
      setActiveVideo(nextActive);

      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 1300);
    }
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <video
        ref={videoRef1}
        className={`hero-video absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
          activeVideo === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={() => {
          if (activeVideo === 1 && videoRef1.current && videoRef2.current) {
            checkTransition(videoRef1.current, videoRef2.current, 2);
          }
        }}
        onEnded={() => {
          if (videoRef1.current) videoRef1.current.currentTime = 0;
        }}
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>

      <video
        ref={videoRef2}
        className={`hero-video absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
          activeVideo === 2 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        muted
        playsInline
        preload="auto"
        onTimeUpdate={() => {
          if (activeVideo === 2 && videoRef2.current && videoRef1.current) {
            checkTransition(videoRef2.current, videoRef1.current, 1);
          }
        }}
        onEnded={() => {
          if (videoRef2.current) videoRef2.current.currentTime = 0;
        }}
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  );
}

export function HomeHeroSection() {
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const [isPro, setIsPro] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      if ((session.user as any)?.plan === "PRO") {
        setIsPro(true);
      }
      fetch("/api/usage", { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.plan === "PRO") {
            setIsPro(true);
          }
        })
        .catch(() => {});
    }
  }, [session]);

  return (
    <section className="home-hero">
      <div className="hero-surface absolute inset-0 z-10" />
      <SeamlessHeroBackground />
      <div className="hero-fade pointer-events-none absolute inset-0 z-20" />

      <div className="home-hero-stack">
        <div className="home-nav-border-wrapper">
          <div className="home-nav-beam" />
          <nav className="home-nav">
            <Link href="/" className="home-brand">
              <span className="relative mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-visible sm:mr-2 sm:h-10 sm:w-10">
                <Image
                  src="/logo.png"
                  alt="Aura Studio"
                  width={72}
                  height={72}
                  className="h-9 w-9 max-h-none max-w-none origin-left scale-[1.5] object-cover sm:h-10 sm:w-10 sm:scale-[1.55]"
                  priority
                />
              </span>
              <div className="min-w-0">
                <span className="caps-2xs block text-xs font-semibold text-foreground sm:text-sm">
                  Aura Studio
                </span>
                <span className="caps-xs block truncate text-[10px] uppercase text-primary sm:text-xs">
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
                <div className="flex items-center gap-2 sm:gap-3">
                  {isPro && (
                    <>
                      <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary shadow-[0_0_15px_rgba(255,180,0,0.2)]">
                        <CrownIcon className="size-3.5 text-primary" />
                        <span>Pro Member</span>
                      </span>
                      <span className="sm:hidden flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                        <CrownIcon className="size-3 text-primary" />
                        <span>PRO</span>
                      </span>
                    </>
                  )}

                  <Button variant="outline" asChild className="home-btn-studio-outline hidden xs:inline-flex">
                    <Link href="/playground" prefetch={false}>
                      Playground
                    </Link>
                  </Button>

                  {user.image && (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="size-7 rounded-full border border-border/60 object-cover sm:size-8"
                    />
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="hidden sm:flex size-8 rounded-full p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOutIcon className="size-4" />
                  </Button>

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-foreground transition-colors hover:bg-white/20 md:hidden cursor-pointer"
                    aria-label="Toggle Navigation"
                  >
                    {isMobileMenuOpen ? <XIcon className="size-4" /> : <MenuIcon className="size-4" />}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => signIn("google")}
                    className="home-btn-signin hidden sm:inline-flex"
                  >
                    <LogInIcon className="mr-1.5 size-3.5" /> Sign In
                  </Button>

                  <Button asChild className="home-btn-nav-primary">
                    <Link href="/playground">Launch Studio</Link>
                  </Button>

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-foreground transition-colors hover:bg-white/20 md:hidden cursor-pointer"
                    aria-label="Toggle Navigation"
                  >
                    {isMobileMenuOpen ? <XIcon className="size-4" /> : <MenuIcon className="size-4" />}
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Drawer */}
          {isMobileMenuOpen && (
            <div className="relative z-10 border-t border-white/10 bg-background/95 px-5 py-4 backdrop-blur-3xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col gap-3">
                {CENTER_NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <span>{link.label}</span>
                    {link.hasDropdown && <ChevronDownIcon className="size-4 opacity-50" />}
                  </Link>
                ))}

                <div className="my-1 border-t border-white/10" />

                {status === "authenticated" && user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-2 py-1">
                      <div className="flex items-center gap-2.5">
                        {user.image && (
                          <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="size-8 rounded-full border border-border/60 object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-foreground">{user.name}</p>
                          <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      {isPro && (
                        <span className="flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                          <CrownIcon className="size-3" /> PRO
                        </span>
                      )}
                    </div>

                    <Button asChild className="home-btn-nav-primary w-full">
                      <Link href="/playground" onClick={() => setIsMobileMenuOpen(false)}>
                        Open AI Playground
                      </Link>
                    </Button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-card/40 py-2 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground cursor-pointer"
                    >
                      <LogOutIcon className="size-3.5" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signIn("google");
                      }}
                      className="w-full rounded-full border border-white/20 bg-white/10 py-2 text-xs font-medium text-foreground cursor-pointer"
                    >
                      <LogInIcon className="mr-2 size-3.5" /> Sign In with Google
                    </Button>
                    <Button asChild className="home-btn-nav-primary w-full">
                      <Link href="/playground" onClick={() => setIsMobileMenuOpen(false)}>
                        Launch AI Studio
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="home-hero-copy">
          <h1 className="hero-title home-hero-title">
            <span className="block">Next-Gen AI Image Studio.</span>
            <span
              style={{ fontFamily: 'Georgia, "Merriweather", "Times New Roman", serif' }}
              className="mt-3 block font-serif text-2xl font-normal italic tracking-tight text-white/95 sm:mt-4 sm:text-3xl md:text-4xl lg:text-[3.25rem] lg:leading-[1.2] [text-shadow:0_4px_30px_rgba(0,0,0,0.8),0_0_45px_rgba(255,140,0,0.25)]"
            >
              Remove Backgrounds, Replace Scenes & Upscale in Real-time.
            </span>
          </h1>

          <p className="home-hero-lede mt-7 max-w-3xl text-pretty text-base font-normal leading-relaxed text-foreground/85 sm:text-lg md:text-[1.25rem] md:leading-relaxed [text-shadow:0_2px_20px_rgba(0,0,0,0.6)]">
            Professional AI image editing powered by Aura Neural Vision Engine. Isolate subjects, generate custom AI environments, enhance micro-details 2x, and stamp dynamic watermarks.
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
                  alt="Aura Studio workspace showing upload, AI tools, and interactive canvas comparison"
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
