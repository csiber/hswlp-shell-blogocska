"use client"

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TagReference from "@/components/tag-reference";
import remarkTagReference from "@/utils/remark-tag-reference";

interface MarkdownViewerProps {
  content: string;
  className?: string;
  postId?: string;
}

export function MarkdownViewer({ content, className, postId }: MarkdownViewerProps) {
  return (
    <ReactMarkdown
      className={className}
      remarkPlugins={[remarkGfm, remarkTagReference]}
      components={{
        a({ href, children }) {
          if (href?.startsWith("tag:")) {
            const value = href.substring(4);
            return <TagReference value={value} sourceId={postId ?? ""} />;
          }
          return <a href={href}>{children}</a>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default MarkdownViewer;
