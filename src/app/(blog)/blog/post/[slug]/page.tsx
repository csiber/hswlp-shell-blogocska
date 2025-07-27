import PostDetail from "@/components/blog/post-detail";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/server/blog";
import { getBlogDB } from "@/db";
import { postsTable, POST_STATUS } from "@/db/schema";
import { generateSlug } from "@/utils/slugify";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  const db = getBlogDB();
  const posts = await db
    .select({ id: postsTable.id, title: postsTable.title, status: postsTable.status })
    .from(postsTable);

  return posts
    .filter(p => p.status === POST_STATUS.APPROVED && p.title)
    .map((post) => ({
      slug: generateSlug(post.title ?? "untitled"),
    }));
}

export default async function Page({ params }: { params: { slug: string } }) {
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
