import { requireAdmin } from "@/utils/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import NewPostForm from "./new-post-form";

export const metadata = {
  title: "New Post",
};

export default async function NewPostPage() {
  const session = await requireAdmin({ doNotThrowError: true });
  if (!session) {
    return redirect("/sign-in");
  }

  return (
    <>
      <PageHeader
        items={[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/dashboard/new-post", label: "New Post" },
        ]}
      />
      <div className="p-4 pt-0">
        <NewPostForm />
      </div>
    </>
  );
}
