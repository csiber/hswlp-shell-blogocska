import { NextResponse } from 'next/server'
import { getBlogDB } from '@/db'
import { postsTable, userTable, postCategoryTable, POST_STATUS } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: Request) {
  const db = getBlogDB()
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1', 10)
  const limit = 20
  const offset = (page - 1) * limit

  const posts = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      content: postsTable.content,
      image_url: postsTable.image_url,
      created_at: postsTable.created_at,
      user_id: postsTable.user_id,
      author_first: userTable.firstName,
      author_nick: userTable.nickname,
      author_last: userTable.lastName,
      category_name: postCategoryTable.name,
    })
    .from(postsTable)
    .leftJoin(userTable, eq(postsTable.user_id, userTable.id))
    .leftJoin(postCategoryTable, eq(postsTable.category, postCategoryTable.slug))
    .where(eq(postsTable.status, POST_STATUS.APPROVED))
    .orderBy(desc(postsTable.created_at))
    .limit(limit)
    .offset(offset)

  const transformed = posts.map(p => ({
    id: p.id,
    title: p.title,
    content: p.content,
    imageUrl: p.image_url,
    createdAt: p.created_at,
    authorName: p.author_nick || `${p.author_first || ''} ${p.author_last || ''}`.trim(),
    category: p.category_name,
  }))

  return NextResponse.json({ posts: transformed })
}
