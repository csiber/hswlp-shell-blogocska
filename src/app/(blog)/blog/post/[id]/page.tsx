import PostDetail from "@/components/blog/post-detail";
import NotFoundComponent from "@/components/blog/not-found-component";
import { getBlogDB } from "@/db";
import { postsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PostPageProps) {
  const { id } = await params;

  let post: { id: string } | undefined = undefined;
  try {
    const db = getBlogDB();
    post = await db.query.postsTable.findFirst({
      where: eq(postsTable.id, id),
      columns: { id: true },
    });
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
