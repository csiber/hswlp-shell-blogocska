import "server-only";

import { getBlogDB } from "@/db";
import { postsTable } from "@/db/schema";
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
