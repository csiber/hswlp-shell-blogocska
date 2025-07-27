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

  const handleDelete = async (id: string) => {
    if (!confirm("Biztosan törlöd a bejegyzést?")) return;
    const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    const json: { success?: boolean; error?: string } = await res.json();
    if (res.ok) {
      setPosts((ps) => ps.filter((pp) => pp.id !== id));
    } else {
      alert(json.error || "Hiba történt");
    }
  };

  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <div key={p.id} className="border-b pb-2 space-y-1">
          <h3 className="font-medium">{p.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CategoryBadge name={p.category_name} />
            <span>{p.status.toLowerCase()}</span>
          </div>
          {p.status === "REJECTED" && p.moderation_note && (
            <p className="text-sm text-destructive mt-1">{p.moderation_note}</p>
          )}
          <div className="flex gap-2 text-sm mt-1">
            <a href={`/edit/${p.id}`} className="text-primary hover:underline">Szerkesztés</a>
            <button onClick={() => handleDelete(p.id)} className="text-destructive hover:underline">
              Törlés
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyPosts;
