import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ success: false, message: "Invalid secret" }, { status: 401 });
  }

  const { slug } = await req.json().catch(() => ({ slug: undefined }));

  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);

  return NextResponse.json({ success: true, revalidated: true, slug: slug ?? null });
}
