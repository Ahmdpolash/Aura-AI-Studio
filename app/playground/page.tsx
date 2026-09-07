"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { PlaygroundWorkbench } from "@/components/playground/PlaygroundWorkbench";
import { ArrowLeftIcon, CrownIcon, LogInIcon, LogOutIcon, SparklesIcon } from "lucide-react";

export default function PlaygroundPage() {
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const isPro = user?.plan === "PRO";

  return (
    <main className="studio-shell min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Header Bar */}
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-full border border-border/50 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              <ArrowLeftIcon className="size-3.5" /> Back Home
            </Link>

            <Link href="/" className="flex min-w-0 items-center gap-3">
              <span className="relative mr-2 flex h-9 w-9 shrink-0 items-center justify-center overflow-visible">
                <Image
                  src="/logo.png"
                  alt="Luma AI Studio"
                  width={64}
                  height={64}
                  className="mt-1 mr-1 max-h-none max-w-none origin-left scale-[1.5] object-cover"
                  priority
                />
              </span>
              <p className="font-mono text-2xl font-bold uppercase tracking-wider text-primary sm:text-3xl">
                Luma Studio
              </p>
            </Link>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {isPro ? (
              <span className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
                <CrownIcon className="size-3.5" /> Pro Member
              </span>
            ) : (
              <span className="studio-pill-strong rounded-full border px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                <SparklesIcon className="mr-1 inline size-3 text-primary" /> AI Playground
              </span>
            )}

            {status === "authenticated" && user ? (
              <div className="flex items-center gap-3">
                {user.image && (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="size-8 rounded-full border border-border/60 object-cover"
                  />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="studio-pill h-8 rounded-full px-3 text-xs"
                >
                  <LogOutIcon className="mr-1.5 size-3" /> Sign Out
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => signIn("google")}
                className="studio-primary-action h-8 rounded-full px-4 text-xs font-semibold"
              >
                <LogInIcon className="mr-1.5 size-3" /> Sign In with Google
              </Button>
            )}
          </div>
        </header>

        {/* Studio Workbench */}
        <PlaygroundWorkbench />
      </div>
    </main>
  );
}
