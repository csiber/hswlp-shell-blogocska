"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface FormValues {
  title: string;
  content: string;
}

export default function NewPostForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const post: { id: string } = await res.json();
      router.push(`/posts/${post.id}`);
    } else {
      alert("Failed to create post");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          className="w-full border rounded p-2"
          placeholder="Title"
          {...register("title", { required: true })}
        />
      </div>
      <div>
        <textarea
          className="w-full border rounded p-2"
          rows={8}
          placeholder="Content"
          {...register("content")}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}
