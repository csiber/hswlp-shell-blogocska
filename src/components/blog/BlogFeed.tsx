"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

interface BlogFeedProps {
  initialPosts: Post[];
  page: number;
  hasNext: boolean;
}

export function BlogFeed({ initialPosts, page, hasNext }: BlogFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

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
              Read more
            </a>
          )}
        </motion.article>
      ))}
      <div className="flex justify-between pt-4">
        {page > 1 ? (
          <Link href={`/?page=${page - 1}`} className="text-primary underline">
            Previous
          </Link>
        ) : (
          <span />
        )}
        {hasNext ? (
          <Link href={`/?page=${page + 1}`} className="text-primary underline">
            Next
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export default BlogFeed;
