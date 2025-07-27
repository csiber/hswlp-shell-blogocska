"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Preview {
  id: string;
  title: string;
  content: string;
  authorName: string;
}

interface PostPreviewModalProps {
  post: Preview;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PostPreviewModal({ post, open, onOpenChange }: PostPreviewModalProps) {
  const excerpt = post.content?.slice(0, 300);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{post.title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-2">{post.authorName}</p>
        <p className="mb-4 whitespace-pre-wrap text-sm">{excerpt}</p>
      </DialogContent>
    </Dialog>
  );
}
