import { z } from 'zod'

export const newPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(1, 'Content is required'),
})

export type NewPostSchema = z.infer<typeof newPostSchema>
