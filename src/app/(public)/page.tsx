import PostsFeed from "@/components/posts-feed";
import NavFooterLayout from "@/layouts/NavFooterLayout";

export default function Page() {
  return (
    <NavFooterLayout>
      <div className="container mx-auto py-6">
        <PostsFeed />
      </div>
    </NavFooterLayout>
  );
}
