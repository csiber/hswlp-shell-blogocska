import { NextResponse } from "next/server";
import { getPostById } from "@/db/post";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const post = await getPostById(params.id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}
