import { SITE_URL } from "@/constants";
import CategoryBadge from "@/components/category-badge";
import MarkdownViewer from "@/components/markdown-viewer";
import ReadRewardTracker from "@/components/read-reward-tracker";

interface PostDetailProps {
  id: string;
}

export default async function PostDetail({ id }: PostDetailProps) {
  const res = await fetch(`${SITE_URL}/api/blog/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }
  const post = await res.json();

  return (
    <article className="prose mx-auto dark:prose-invert">
      <h1>{post.title}</h1>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{post.authorName}</span>
        <CategoryBadge name={post.category} />
      </div>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="" className="my-4 rounded-md" />
      )}
      <MarkdownViewer content={post.content} className="mt-4" postId={post.id} />
      <ReadRewardTracker postId={post.id} />
    </article>
  );
}
