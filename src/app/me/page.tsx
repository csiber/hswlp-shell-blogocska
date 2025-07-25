import { redirect } from "next/navigation";
import { getSessionFromCookie } from "@/utils/auth";
import MyPosts from "@/components/blog/my-posts";
import NavFooterLayout from "@/layouts/NavFooterLayout";

export default async function Page() {
  const session = await getSessionFromCookie();
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <NavFooterLayout>
      <div className="container mx-auto py-6">
        <MyPosts />
      </div>
    </NavFooterLayout>
  );
}
