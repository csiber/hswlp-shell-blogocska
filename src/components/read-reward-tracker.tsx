"use client"

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useIntersectionObserver } from "usehooks-ts";

interface ReadRewardTrackerProps {
  postId: string;
}

export function ReadRewardTracker({ postId }: ReadRewardTrackerProps) {
  const start = useRef(Date.now());
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(sentinelRef, {});
  const marked = useRef(false);

  useEffect(() => {
    if (entry?.isIntersecting && !marked.current) {
      const durationSec = Math.floor((Date.now() - start.current) / 1000);
      if (durationSec >= 15) {
        marked.current = true;
        fetch("/api/blog/mark-read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post_id: postId, duration_sec: durationSec }),
        }).then(() => {
          toast.success("Pontot szereztél az olvasásért!");
        });
      }
    }
  }, [entry, postId]);

  return <div ref={sentinelRef} className="h-px" />;
}

export default ReadRewardTracker;
