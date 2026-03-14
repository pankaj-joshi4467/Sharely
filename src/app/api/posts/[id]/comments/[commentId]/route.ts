import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { commentId } = params;

    const existing = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!existing) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/posts/:id/comments/:commentId]", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
