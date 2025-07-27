import PostDetail from "@/components/blog/post-detail";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/server/blog";
import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "@/db/schema";
import { generateSlug } from "@/utils/slugify";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) {
      return [];
    }
    const db = drizzle(env.DB, { schema, logger: true });
    const posts = await db.select({ title: schema.postsTable.title }).from(schema.postsTable);
    return posts.map(post => ({
      slug: generateSlug(post.title || "untitled"),
    }));
  } catch {
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params }: any) {
  const slug = decodeURIComponent(params.slug);
  const result = await getPostBySlug(slug);

  if (!result) {
    notFound();
  }

  return (
    <main className="container mx-auto py-6">
      <PostDetail id={result.id} />
    </main>
  );
}
