import { SITE_URL } from "@/constants";
import { getSessionFromCookie } from "@/utils/auth";
import PostEditForm from "@/components/blog/post-edit-form";
import { redirect } from "next/navigation";

interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  categorySlug: string;
  imageUrl?: string | null;
}

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: EditPageProps) {
  const session = await getSessionFromCookie();
  if (!session) {
    redirect("/sign-in");
  }
  const { id } = await params;
  const res = await fetch(`${SITE_URL}/api/blog/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }
  const post: Post = await res.json() as Post;
  if (session.user.id !== post.userId && session.user.role !== "admin") {
    redirect("/");
  }
  return (
    <main className="container mx-auto py-6">
      <PostEditForm post={post} />
    </main>
  );
}
