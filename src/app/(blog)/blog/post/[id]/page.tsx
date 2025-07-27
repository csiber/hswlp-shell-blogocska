import PostDetail from "@/components/blog/post-detail";
import NotFoundComponent from "@/components/blog/not-found-component";
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PostPageProps) {
  const { id } = await params;

  let post: { id: string } | null = null;
  try {
    const { env } = getCloudflareContext();
    post = await env.DB.prepare(
      `SELECT id FROM posts WHERE id = ?`
    )
      .bind(id)
      .first<{ id: string }>();
  } catch (err) {
    console.error("Failed to load post", err);
  }

  if (!post) {
    return <NotFoundComponent />;
  }

  return (
    <main className="container mx-auto py-6">
      <PostDetail id={id} />
    </main>
  );
}
