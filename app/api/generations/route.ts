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
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ generations: [] });
    }

    const generations = await prisma.generation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ generations });
  } catch (error) {
    console.error("Fetch generations error:", error);
    return NextResponse.json({ error: "Failed to fetch generations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { originalImageUrl, originalFileName, resultImageUrl, toolType, prompt } = body;

    if (!originalImageUrl || !resultImageUrl || !toolType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        originalImageUrl,
        originalFileName: originalFileName || null,
        resultImageUrl,
        toolType,
        prompt: prompt || null,
      },
    });

    return NextResponse.json({ generation });
  } catch (error) {
    console.error("Save generation error:", error);
    return NextResponse.json({ error: "Failed to save generation" }, { status: 500 });
  }
}
