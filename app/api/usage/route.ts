import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        plan: true,
        usageCount: true,
        usageLimit: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPro = user.plan === "PRO";
    const canUpload = isPro || user.usageCount < user.usageLimit;

    return NextResponse.json(
      {
        usageCount: user.usageCount,
        usageLimit: isPro ? 999999 : user.usageLimit,
        plan: user.plan,
        canUpload,
        remaining: isPro ? 999999 : Math.max(0, user.usageLimit - user.usageCount),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Usage check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        plan: true,
        usageCount: true,
        usageLimit: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPro = user.plan === "PRO";

    if (!isPro && user.usageCount >= user.usageLimit) {
      return NextResponse.json(
        {
          error: "Usage limit reached. Upgrade to Pro for unlimited edits.",
          usageCount: user.usageCount,
          usageLimit: user.usageLimit,
          plan: user.plan,
          canUpload: false,
        },
        { status: 403 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        usageCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        usageCount: true,
        usageLimit: true,
        plan: true,
      },
    });

    return NextResponse.json({
      usageCount: updatedUser.usageCount,
      usageLimit: isPro ? 999999 : updatedUser.usageLimit,
      plan: updatedUser.plan,
      canUpload: isPro || updatedUser.usageCount < updatedUser.usageLimit,
      remaining: isPro ? 999999 : Math.max(0, updatedUser.usageLimit - updatedUser.usageCount),
    });
  } catch (error) {
    console.error("Usage increment error:", error);
    return NextResponse.json({ error: "Failed to update usage" }, { status: 500 });
  }
}
