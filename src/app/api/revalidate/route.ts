// This code was created by a human and debugged by AI
import { NextRequest, NextResponse } from "next/server";
import { isCacheTag, revalidateCacheTag } from "@/lib/cache/revalidate";
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url); const secret = searchParams.get("secret"); const tag = searchParams.get("tag");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!tag || !isCacheTag(tag)) return NextResponse.json({ message: "Unsupported cache tag" }, { status: 400 });
  revalidateCacheTag(tag); return NextResponse.json({ revalidated: true, tag, timestamp: new Date().toISOString() });
}
