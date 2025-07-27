import PostDetail from "@/components/blog/post-detail";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/server/blog";
import { getBlogDB } from "@/db";
import { postsTable, POST_STATUS } from "@/db/schema";
import { generateSlug } from "@/utils/slugify";

interface PostPageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  const db = getBlogDB();
  const posts = await db
    .select({ id: postsTable.id, title: postsTable.title, status: postsTable.status })
    .from(postsTable);

  return posts
    .filter(p => p.status === POST_STATUS.APPROVED)
    .map((post) => ({ slug: generateSlug(post.title || post.id) }));
}

export default async function Page({ params }: PostPageProps) {
  const slug = params.slug;

  const result = await getPostBySlug(decodeURIComponent(slug));

  if (!result) {
    notFound();
  }

  return (
    <main className="container mx-auto py-6">
      <PostDetail id={result.id} />
    </main>
  );
}
