import BlogFeed from "@/components/blog/BlogFeed";
import NavFooterLayout from "@/layouts/NavFooterLayout";

export default function Page() {
  return (
    <NavFooterLayout>
      <div className="container mx-auto py-6">
        <BlogFeed />
      </div>
    </NavFooterLayout>
  );
}
