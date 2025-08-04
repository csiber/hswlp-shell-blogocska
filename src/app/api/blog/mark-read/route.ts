import { NextResponse } from "next/server";
import { getBlogDB } from "@/db";
import { postReadTable } from "@/db/schema";
import { getSessionFromCookie } from "@/utils/auth";

async function hashIp(ip: string) {
  const data = new TextEncoder().encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: Request) {
  const { post_id, duration_sec } = await req.json();
  const session = await getSessionFromCookie();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const ip = req.headers.get("cf-connecting-ip") ?? "";
  const ipHash = await hashIp(ip);
  const db = getBlogDB();
  await db.insert(postReadTable).values({
    post_id,
    user_id: session.user.id,
    ip_hash: ipHash,
    duration_sec,
  });
  return NextResponse.json({ ok: true });
}
