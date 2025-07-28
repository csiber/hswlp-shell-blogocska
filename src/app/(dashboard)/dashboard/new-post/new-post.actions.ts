"use server";

import { createServerAction, ZSAError } from "zsa";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { requireAdmin } from "@/utils/auth";
import { generateSlug } from "@/utils/slugify";
import { newPostSchema } from "@/schemas/new-post.schema";

export const createPostAction = createServerAction()
  .input(newPostSchema)
  .handler(async ({ input }) => {
    const session = await requireAdmin({ doNotThrowError: false });
    if (!session?.user?.id) {
      throw new ZSAError("NOT_AUTHORIZED", "Unauthorized");
    }

    const { env } = getCloudflareContext();
    if (!env.DB) {
      throw new ZSAError("INTERNAL_SERVER_ERROR", "Database not available");
    }

    const id = crypto.randomUUID();
    const slug = generateSlug(input.title);
    const now = Math.floor(Date.now() / 1000);

    await env.DB.prepare(
      `INSERT INTO posts (id, user_id, title, content, category, status, image_url, created_at, updated_at, slug)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)`
    )
      .bind(
        id,
        session.user.id,
        input.title,
        input.content,
        input.category,
        'approved',
        null,
        now,
        now,
        slug,
      )
      .run();

    return { success: true };
  });
