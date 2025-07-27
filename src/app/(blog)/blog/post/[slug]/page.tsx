import PostDetail from "@/components/blog/post-detail";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/server/blog";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  return [];
}

export default async function Page({ params }: PostPageProps) {
  const { slug } = await params;

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
