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
    userId: post.user_id,
    title: post.title,
    content: post.content,
    imageUrl: post.image_url,
    createdAt: post.created_at,
    status: post.status,
    category: post.category_name,
    categorySlug: post.category,
    authorName: post.author_nick || `${post.author_first || ''} ${post.author_last || ''}`.trim(),
  }

  return NextResponse.json(result)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookie()
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const db = getBlogDB()
  const post = await db.query.postsTable.findFirst({ where: eq(postsTable.id, id) })
  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (session.user.id !== post.user_id && session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = (await request.json()) as Partial<{
    title: string
    content: string
    category: string
    image_url: string | null
  }>

  const updateData: Record<string, unknown> = {}
  if (body.title !== undefined) updateData.title = body.title
  if (body.content !== undefined) updateData.content = body.content
  if (body.category !== undefined) updateData.category = body.category
  if (body.image_url !== undefined) updateData.image_url = body.image_url

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  await db.update(postsTable).set(updateData).where(eq(postsTable.id, id))

  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookie()
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const db = getBlogDB()
  const post = await db.query.postsTable.findFirst({ where: eq(postsTable.id, id) })
  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (session.user.id !== post.user_id && session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await db.delete(postsTable).where(eq(postsTable.id, id))

  return NextResponse.json({ success: true })
}
