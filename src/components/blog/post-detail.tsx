import CategoryBadge from "@/components/category-badge";
import MarkdownViewer from "@/components/markdown-viewer";
import ReadRewardTracker from "@/components/read-reward-tracker";
import NotFoundComponent from "@/components/blog/not-found-component";

interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  category: string;
  imageUrl?: string | null;
}

interface PostDetailProps {
  id: string;
}

export default async function PostDetail({ id }: PostDetailProps) {
  let post: Post | null = null;
  try {
    const res = await fetch(`/api/blog/${id}`, { cache: "no-store" });
    if (res.status === 404) {
      return <NotFoundComponent />;
    }
    if (!res.ok) {
      console.error("Failed to fetch post", res.statusText);
      return <NotFoundComponent />;
    }
    post = (await res.json()) as Post;
  } catch (err) {
    console.error("Error loading post", err);
    return <NotFoundComponent />;
  }

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
      <MarkdownViewer content={post.content} className="mt-4 prose leading-relaxed" postId={post.id} />
      <ReadRewardTracker postId={post.id} />
    </article>
  );
}
