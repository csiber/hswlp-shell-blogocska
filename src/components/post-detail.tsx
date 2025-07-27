"use client";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string | null;
}

export default function PostDetail({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => (res.ok ? res.json() as Promise<Post> : null))
      .then((data) => setPost(data))
      .catch(() => {});
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <article className="prose dark:prose-invert">
      <h1>{post.title}</h1>
      {post.content && <p className="whitespace-pre-wrap">{post.content}</p>}
    </article>
  );
}
