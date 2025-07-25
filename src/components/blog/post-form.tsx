"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSessionStore } from "@/state/session";
import MarkdownViewer from "@/components/markdown-viewer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
    const json = await res.json();
    if (res.ok) {
      router.push(`/post/${json.id}`);
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
        <Textarea id="content" rows={8} {...register("content", { required: true })} />
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
