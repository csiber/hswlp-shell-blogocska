import "server-only";

import { getBlogDB } from "@/db";
import { postsTable, POST_STATUS } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/utils/slugify";

/**
 * Fetch a post ID by slug or ID. Returns undefined if not found.
 */
export async function getPostBySlug(slug: string): Promise<{ id: string } | undefined> {
  const db = getBlogDB();

  // Try direct match by ID first
  const byId = await db.query.postsTable.findFirst({
    where: eq(postsTable.id, slug),
    columns: { id: true },
  });
  if (byId) return byId;

  // Otherwise compare against slugified titles
  const candidates = await db
    .select({ id: postsTable.id, title: postsTable.title })
    .from(postsTable);
  const match = candidates.find((p) => generateSlug(p.title || "") === slug);
  if (match) {
    return { id: match.id };
  }
  return undefined;
}

/**
 * Return all approved posts with their slug generated from the title.
 */
export async function getAllApprovedPosts(): Promise<{ slug: string }[]> {
  const db = getBlogDB();
  const posts = await db
    .select({ title: postsTable.title })
    .from(postsTable)
    .where(eq(postsTable.status, POST_STATUS.APPROVED));

  return posts.map((p) => ({ slug: generateSlug(p.title || "untitled") }));
}
