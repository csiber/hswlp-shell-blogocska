import BlogFeed from "@/components/blog/BlogFeed";
import { SITE_URL } from "@/constants";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const currentPage = parseInt((params.page as string) ?? "1", 10);
  const res = await fetch(
    `${SITE_URL}/api/blog/feed?page=${currentPage}&limit=25`,
    { cache: "no-store" }
  );
  const data: { posts?: unknown[] } = await res.json();
  const posts = (data.posts ?? []) as any[];
  const hasNext = posts.length === 25;

  return (
    <main className="container mx-auto py-6">
      <BlogFeed initialPosts={posts} page={currentPage} hasNext={hasNext} />
    </main>
  );
}
