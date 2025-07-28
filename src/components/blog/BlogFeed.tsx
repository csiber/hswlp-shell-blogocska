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
  createdAt: number;
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
          className="mx-auto max-w-3xl rounded-xl border bg-muted dark:bg-zinc-900 text-card-foreground p-6 shadow transition hover:shadow-lg data-[visible]:animate-in data-[visible]:fade-in"
        >
          <h2 className="text-xl font-bold">{p.title}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-primary">{p.authorName}</span>
            <time dateTime={new Date(p.createdAt).toISOString()}>
              {new Date(p.createdAt).toLocaleDateString("hu-HU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
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
            className="mt-2 text-sm leading-relaxed prose dark:text-white"
            postId={p.id}
          />
          {p.content.length > 300 && (
            <a
              href={`/blog/post/${p.id}`}
              className="mt-4 inline-block text-primary underline"
            >
              Tovább
            </a>
          )}
        </motion.article>
      ))}
      {hasMore && <div ref={loaderRef} className="h-10" />}
    </div>
  );
}

export default BlogFeed;
