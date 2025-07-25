import { redirect } from "next/navigation";
import { getSessionFromCookie } from "@/utils/auth";
import PostForm from "@/components/blog/post-form";
import NavFooterLayout from "@/layouts/NavFooterLayout";

export default async function Page() {
  const session = await getSessionFromCookie();
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <NavFooterLayout>
      <div className="container mx-auto py-6">
        <PostForm />
      </div>
    </NavFooterLayout>
  );
}
