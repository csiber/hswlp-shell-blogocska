import { NextResponse } from 'next/server'
import { getBlogDB } from '@/db'
import { postsTable, userTable, postCategoryTable, POST_STATUS } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getSessionFromCookie } from '@/utils/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getBlogDB()
  const session = await getSessionFromCookie()
  const { id: postId } = await params

  const [post] = await db
    .select({
      id: postsTable.id,
      user_id: postsTable.user_id,
      title: postsTable.title,
      content: postsTable.content,
      image_url: postsTable.image_url,
      category: postsTable.category,
      status: postsTable.status,
      created_at: postsTable.created_at,
      author_first: userTable.firstName,
      author_nick: userTable.nickname,
      author_last: userTable.lastName,
      category_name: postCategoryTable.name,
    })
    .from(postsTable)
    .leftJoin(userTable, eq(postsTable.user_id, userTable.id))
    .leftJoin(postCategoryTable, eq(postsTable.category, postCategoryTable.slug))
    .where(eq(postsTable.id, postId))
    .limit(1)

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (
    post.status !== POST_STATUS.APPROVED &&
    (!session || session.user.id !== post.user_id)
  ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const result = {
    id: post.id,
    title: post.title,
    content: post.content,
    imageUrl: post.image_url,
    createdAt: post.created_at,
    status: post.status,
    category: post.category_name,
    authorName: post.author_nick || `${post.author_first || ''} ${post.author_last || ''}`.trim(),
  }

  return NextResponse.json(result)
}
