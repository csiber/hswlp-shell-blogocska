import { NextResponse } from "next/server";
import { getAllPosts } from "@/db/post";

export async function GET() {
  const posts = await getAllPosts();
  return NextResponse.json(posts);
}

