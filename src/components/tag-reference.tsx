"use client";

import { useEffect, useState } from "react";
import PostPreviewModal from "@/components/post-preview-modal";

interface Preview {
  id: string;
  title: string;
  content: string;
  authorName: string;
}

interface TagReferenceProps {
  value: string;
  sourceId: string;
}

export default function TagReference({ value, sourceId }: TagReferenceProps) {
  const [post, setPost] = useState<Preview | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/resolve-tag?source=${sourceId}&ref=${value}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.post) {
          setPost(data.post as Preview);
        }
      })
      .catch(() => {});
  }, [sourceId, value]);

  const clickable = !!post;

  return (
    <>
      <span
        onClick={clickable ? () => setOpen(true) : undefined}
        className={clickable
          ? "text-primary font-semibold cursor-pointer hover:underline"
          : "text-muted-foreground"}
      >
        @{value}
      </span>
      {post && (
        <PostPreviewModal
          open={open}
          onOpenChange={setOpen}
          post={post}
        />
      )}
    </>
  );
}
