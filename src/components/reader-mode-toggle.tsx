"use client";

import { useEffect } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReaderModeStore } from "@/state/reader";
import { cn } from "@/lib/utils";

interface ReaderModeToggleProps {
  className?: string;
  children?: React.ReactNode;
}

export default function ReaderModeToggle({
  className,
  children,
}: ReaderModeToggleProps) {
  const { enabled, toggle } = useReaderModeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("reader-mode", enabled);
  }, [enabled]);

  return (
    <Button
      variant="ghost"
      size={children ? "default" : "icon"}
      onClick={toggle}
      className={cn(className)}
    >
      <BookOpen className="h-5 w-5" />
      {children && <span className="ml-2">{children}</span>}
    </Button>
  );
}
