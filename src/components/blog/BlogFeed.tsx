"use client"

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import TagHighlight from "@/components/tag-highlight";
import CategoryBadge from "@/components/category-badge";
import Link from "next/link";
import { generateSlug } from "@/utils/slugify";

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
  const [loading, setLoading] = useState(false);
  const { ref: loaderRef, entry } = useIntersectionObserver({});

  const loadPosts = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/feed?page=${page}&limit=10`)

      if (!res.ok) {
        console.error('Failed to fetch posts', res.status)
        setHasMore(false)
        return
      }

      const data: { posts?: Post[] } = await res.json()

      if (data.posts?.length) {
        setPosts((p) => [...p, ...(data.posts ?? [])])
        setPage((prev) => prev + 1)
        if (data.posts.length < 10) setHasMore(false)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error('Failed to load posts', err)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (entry?.isIntersecting && hasMore) {
      loadPosts();
    }
  }, [entry, hasMore]);

  const truncate = (str: string, n: number) =>
    str.length > n ? str.slice(0, n - 1) + "…" : str;

  return (
    <div className="space-y-6">
      {posts.map((p) => (
        <article key={p.id} className="border-b pb-4">
          <h2 className="text-xl font-bold">
            <Link
              href={`/blog/post/${generateSlug(p.title || p.id)}`}
              prefetch={false}
              className="hover:underline"
            >
              {p.title}
            </Link>
          </h2>
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
          <p className="mt-2 text-sm leading-relaxed prose dark:prose-invert">
            <TagHighlight text={truncate(p.content, 300)} sourceId={p.id} />
          </p>
          <Link
            href={`/blog/post/${generateSlug(p.title || p.id)}`}
            prefetch={false}
            className="text-sm text-primary hover:underline"
          >
            Bővebben
          </Link>
        </article>
      ))}
      {hasMore && <div ref={loaderRef} className="h-10" />}
    </div>
  );
}

export default BlogFeed;
