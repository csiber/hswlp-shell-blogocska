"use client"

import { useEffect, useState } from "react";
import { useSessionStore } from "@/state/session";
import CategoryBadge from "@/components/category-badge";

interface MyPost {
  id: string;
  title: string;
  status: string;
  category_name: string;
  moderation_note?: string | null;
}

export function MyPosts() {
  const session = useSessionStore((s) => s.session);
  const [posts, setPosts] = useState<MyPost[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/blog/user/${session.user.id}`)
      .then((res) => res.json() as Promise<{ posts?: MyPost[] }>)
      .then((data) => setPosts(data.posts ?? []));
  }, [session]);

  if (!session) return null;

  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <div
          key={p.id}
          className="rounded-md border border-border bg-card shadow-sm p-4"
        >
          <h3 className="font-medium">{p.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CategoryBadge name={p.category_name} />
            <span>{p.status.toLowerCase()}</span>
          </div>
          {p.status === "REJECTED" && p.moderation_note && (
            <p className="text-sm text-destructive mt-1">{p.moderation_note}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyPosts;
