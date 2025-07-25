import PostDetail from "@/components/blog/post-detail";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto py-6">
      {/* @ts-expect-error Async Server Component */}
      <PostDetail id={params.id} />
    </main>
  );
}
