import { NextResponse } from 'next/server'
import { getBlogDB } from '@/db'
import { postsTable, postCategoryTable } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getSessionFromCookie } from '@/utils/auth'

export async function GET(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  const session = await getSessionFromCookie()
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const targetUserId = params.user_id
  if (session.user.id !== targetUserId && session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

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
      created_at: postsTable.created_at,
      status: postsTable.status,
      image_url: postsTable.image_url,
      category_name: postCategoryTable.name,
    })
    .from(postsTable)
    .leftJoin(postCategoryTable, eq(postsTable.category, postCategoryTable.slug))
    .where(eq(postsTable.user_id, targetUserId))
    .orderBy(desc(postsTable.created_at))
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ posts })
}
