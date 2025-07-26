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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      remarkPlugins={[remarkGfm, remarkTagReference as any]}
      components={{
        a({ href, children }) {
          if (href?.startsWith("tag:")) {
            const value = href.substring(4);
            return <TagReference value={value} sourceId={postId ?? ""} />;
          }
          return <a href={href}>{children}</a>;
        },
        img({ src, alt }) {
          if (alt === "youtube" && src) {
            const srcStr = String(src)
            const id = srcStr.includes("http")
              ? new URL(srcStr).searchParams.get("v") || srcStr
              : srcStr
            return (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                className="w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )
          }
          return <img src={src ?? ""} alt={alt} />
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default MarkdownViewer;
