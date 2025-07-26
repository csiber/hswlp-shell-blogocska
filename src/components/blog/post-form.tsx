"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSessionStore } from "@/state/session";
import MarkdownViewer from "@/components/markdown-viewer";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import { useRef } from "react";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { value: "alom", label: "Álom" },
  { value: "vers", label: "Vers" },
  { value: "tortenet", label: "Történet" },
];

interface FormValues {
  title: string;
  category: string;
  content: string;
}

export function PostForm() {
  const router = useRouter();
  const session = useSessionStore((s) => s.session);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { category: categories[0].value },
  });
  const content = watch("content");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await fetch("/api/blog/image/upload", {
      method: "POST",
      body: file,
    });
    const json: { url?: string; key?: string; error?: string } = await res.json();
    if (res.ok && json.url) {
      setValue("content", `${content || ""}\n![${file.name}](${json.url})\n`);
    } else {
      toast.error(json.error || "Hiba a kép feltöltésekor");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleYoutube = () => {
    const url = prompt("YouTube link?");
    if (!url) return;
    const id = url.includes("v=") ? new URL(url).searchParams.get("v") : url.split("/").pop();
    if (!id) return;
    setValue("content", `${content || ""}\n![youtube](${id})\n`);
  };

  const onSubmit = async (data: FormValues) => {
    if (
      session?.user.role !== "admin" &&
      (session?.user.currentCredits ?? 0) < 1
    ) {
      toast.error("Nincs elég kredited a poszthoz");
      return;
    }
    const res = await fetch("/api/blog/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json: { id?: string; error?: string } = await res.json();
    if (res.ok) {
      router.push(`/blog/post/${json.id}`);
    } else {
      toast.error(json.error || "Hiba történt");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Cím</Label>
        <Input id="title" {...register("title", { required: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Kategória</Label>
        <Select
          value={watch("category")}
          onValueChange={(v) => setValue("category", v)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Kategória" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Tartalom</Label>
        <MDEditor
          value={content}
          onChange={(v) => setValue("content", v || "")}
          textareaProps={{ id: "content" }}
        />
        <div className="flex gap-2 mt-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button type="button" onClick={() => fileInputRef.current?.click()}>Kép feltöltése</Button>
          <Button type="button" onClick={handleYoutube}>YouTube beágyazás</Button>
        </div>
        <div className="prose dark:prose-invert mt-2">
          <MarkdownViewer content={content || ""} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          Közzététel
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
