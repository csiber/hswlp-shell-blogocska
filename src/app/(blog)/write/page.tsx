import { redirect } from "next/navigation";
import { getSessionFromCookie } from "@/utils/auth";
import PostForm from "@/components/blog/post-form";

export default async function Page() {
  const session = await getSessionFromCookie();
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <main className="container mx-auto py-6">
      <PostForm />
    </main>
  );
}
