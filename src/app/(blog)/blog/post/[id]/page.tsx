import PostDetail from "@/components/blog/post-detail";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PostPageProps) {
  const { id } = await params;
  return (
    <main className="container mx-auto py-6">
      {/* @ts-expect-error Async Server Component */}
      <PostDetail id={id} />
    </main>
  );
}
