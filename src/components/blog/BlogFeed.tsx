"use client"

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { motion } from "motion/react";
import MarkdownViewer from "@/components/markdown-viewer";
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
  const { ref: loaderRef, entry } = useIntersectionObserver({});

  const loadPosts = async (pageNum: number) => {
    const res = await fetch(`/api/blog/feed?page=${pageNum}&limit=10`);
    const data: { posts?: Post[] } = await res.json();
    if (data.posts?.length) {
      setPosts((p) => [...p, ...(data.posts ?? [])]);
      if (data.posts.length < 10) setHasMore(false);
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

  return (
    <div className="space-y-8">
      {posts.map((p) => (
        <motion.article
          key={p.id}
          className="rounded-xl border bg-card text-card-foreground p-4 shadow transition hover:shadow-lg data-[visible]:animate-in data-[visible]:fade-in"
        >
          <h2 className="text-xl font-bold">{p.title}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-primary">{p.authorName}</span>
            <CategoryBadge name={p.category} />
          </div>
          {p.imageUrl && (
            <img
              src={p.imageUrl}
              alt=""
              className="my-2 max-h-60 w-full rounded-md object-cover"
            />
          )}
          <MarkdownViewer
            content={p.content}
            className="mt-2 text-sm leading-relaxed prose"
            postId={p.id}
          />
        </motion.article>
      ))}
      {hasMore && <div ref={loaderRef} className="h-10" />}
    </div>
  );
}

export default BlogFeed;
