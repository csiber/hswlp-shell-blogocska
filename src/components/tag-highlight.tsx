"use client"

import React from "react";
import TagReference from "@/components/tag-reference";

interface TagHighlightProps {
  text: string;
  sourceId: string;
}

export function TagHighlight({ text, sourceId }: TagHighlightProps) {
  const parts = text.split(/(@[a-zA-Z0-9_-]{3,32})/g);
  return (
    <>
      {parts.map((part, idx) => {
        const match = part.match(/^@([a-zA-Z0-9_-]{3,32})$/);
        if (match) {
          return (
            <TagReference key={idx} value={match[1]} sourceId={sourceId} />
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
}

export default TagHighlight;
