import PostDetail from "@/components/post-detail";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return (
    <main className="container mx-auto py-6">
      <PostDetail id={params.id} />
    </main>
  );
}
