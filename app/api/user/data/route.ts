import { NextRequest, NextResponse } from "next/server";
import { clearUserData } from "@/db";
import { clearResumeCache } from "@/lib/parsers/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const maxDuration = 60;

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    // Purge database/local stored user analyses
    await clearUserData(userId);

    // Purge server-side resume memory cache
    clearResumeCache();

    return NextResponse.json({
      success: true,
      message: "All resume data, caches, and saved analyses have been permanently deleted.",
    });
  } catch (err: any) {
    console.error("Delete user data error:", err);
    return NextResponse.json(
      { error: "Failed to delete user data." },
      { status: 500 }
    );
  }
}

