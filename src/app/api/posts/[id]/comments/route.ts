import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("[GET /api/posts/:id/comments]", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { content, authorName } = body as { content: string; authorName?: string };

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    if (content.trim().length > 300) {
      return NextResponse.json({ error: "Comment too long" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const name =
      typeof authorName === "string" && authorName.trim().length > 0
        ? authorName.trim().slice(0, 50)
        : "Anonymous";

    const comment = await prisma.comment.create({
      data: { content: content.trim(), authorName: name, postId: id },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("[POST /api/posts/:id/comments]", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
