import PostDetail from "@/components/blog/post-detail";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllApprovedPosts } from "@/server/blog";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  try {
    const posts = await getAllApprovedPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PostPageProps) {
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
