"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import UploadBox from "@/components/ui/upload-box";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { type NewPostSchema, newPostSchema } from "@/schemas/new-post.schema";
import { createPostAction } from "./new-post.actions";

export function NewPostForm() {
  const form = useForm<NewPostSchema>({
    resolver: zodResolver(newPostSchema),
  });

  const { execute: createPost } = useServerAction(createPostAction, {
    onError: (error) => {
      toast.dismiss();
      toast.error(error.err?.message || "Failed to save post");
    },
    onStart: () => {
      toast.loading("Saving post...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Post saved successfully");
      form.reset();
    },
  });

  function onSubmit(values: NewPostSchema) {
    createPost(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea rows={6} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <UploadBox className="mt-2" />
        <div className="flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}

export default NewPostForm;
