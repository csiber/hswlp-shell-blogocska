"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type ModerationPost = {
  id: string;
  title: string | null;
  content: string | null;
  userId: string;
  authorName: string;
  category: string | null;
  createdAt: Date;
};

interface Props {
  initialPosts: ModerationPost[];
}

export default function ModerationClient({ initialPosts }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({});
  const [showReject, setShowReject] = useState<Record<string, boolean>>({});

  async function handleAction(
    postId: string,
    action: "approve" | "reject" | "delete",
    note?: string,
  ) {
    const res = await fetch("/api/blog/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId, action, note }),
    });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Moderation sikeres");
    } else {
      toast.error("Hiba történt");
    }
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {post.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {post.authorName} · {post.category ?? "nincs kategória"} ·{" "}
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </CardHeader>
          <CardContent>
            <p>
              {post.content?.slice(0, 500)}
              {post.content && post.content.length > 500 ? "…" : null}
            </p>
            {showReject[post.id] && (
              <Textarea
                className="mt-4"
                placeholder="Megjegyzés az elutasításhoz"
                value={rejectNote[post.id] || ""}
                onChange={(e) =>
                  setRejectNote({ ...rejectNote, [post.id]: e.target.value })
                }
              />
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={() => handleAction(post.id, "approve")}>
              ✅ Jóváhagyás
            </Button>
            {showReject[post.id] ? (
              <>
                <Button
                  variant="destructive"
                  onClick={() =>
                    handleAction(post.id, "reject", rejectNote[post.id])
                  }
                >
                  Elutasítás küldése
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setShowReject({ ...showReject, [post.id]: false })
                  }
                >
                  Mégse
                </Button>
              </>
            ) : (
              <Button
                variant="destructive"
                onClick={() =>
                  setShowReject({ ...showReject, [post.id]: true })
                }
              >
                ❌ Elutasítás
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Biztosan törlöd?")) {
                  handleAction(post.id, "delete");
                }
              }}
            >
              🗑️ Törlés
            </Button>
          </CardFooter>
        </Card>
      ))}
      {posts.length === 0 && (
        <p className="text-center text-muted-foreground">
          Nincs függőben lévő poszt.
        </p>
      )}
    </div>
  );
}
