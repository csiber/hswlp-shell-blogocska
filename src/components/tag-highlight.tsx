"use client"

import React from "react";

interface TagHighlightProps {
  text: string;
}

export function TagHighlight({ text }: TagHighlightProps) {
  const parts = text.split(/(@\w+)/g);
  return (
    <>
      {parts.map((part, idx) =>
        part.match(/^@\w+/) ? (
          <span key={idx} className="text-primary font-semibold">
            {part}
          </span>
        ) : (
          <React.Fragment key={idx}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export default TagHighlight;
