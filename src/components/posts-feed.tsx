"use client";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string | null;
}

export default function PostsFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.ok ? res.json() as Promise<Post[]> : [])
      .then((data) => setPosts(data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <article key={p.id} className="border-b pb-4">
          <h2 className="text-lg font-bold">
            <a href={`/posts/${p.id}`} className="hover:underline">
              {p.title}
            </a>
          </h2>
          {p.content && (
            <p className="text-sm whitespace-pre-wrap">
              {p.content.slice(0, 200)}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
