"use client"

import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import TagHighlight from "@/components/tag-highlight";
import CategoryBadge from "@/components/category-badge";

interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  category: string;
  imageUrl?: string | null;
}

export function BlogFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(loaderRef, {});

  const loadPosts = async (pageNum: number) => {
    const res = await fetch(`/api/blog/feed?page=${pageNum}`);
    const data = await res.json();
    if (data.posts?.length) {
      setPosts((p) => [...p, ...data.posts]);
      if (data.posts.length < 20) setHasMore(false);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    loadPosts(1);
    setPage(2);
  }, []);

  useEffect(() => {
    if (entry?.isIntersecting && hasMore) {
      loadPosts(page);
      setPage((p) => p + 1);
    }
  }, [entry, hasMore, page]);

  const truncate = (str: string, n: number) =>
    str.length > n ? str.slice(0, n - 1) + "…" : str;

  return (
    <div className="space-y-6">
      {posts.map((p) => (
        <article key={p.id} className="border-b pb-4">
          <h2 className="text-xl font-bold">{p.title}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{p.authorName}</span>
            <CategoryBadge name={p.category} />
          </div>
          {p.imageUrl && (
            <img
              src={p.imageUrl}
              alt=""
              className="my-2 max-h-60 w-full rounded-md object-cover"
            />
          )}
          <p className="mt-2 text-sm">
            <TagHighlight text={truncate(p.content, 300)} sourceId={p.id} />
          </p>
        </article>
      ))}
      {hasMore && <div ref={loaderRef} className="h-10" />}
    </div>
  );
}

export default BlogFeed;
