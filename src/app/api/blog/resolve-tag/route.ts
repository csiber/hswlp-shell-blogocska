import { NextResponse } from 'next/server'
import { getBlogDB } from '@/db'
import { postsTable, userTable, postTagTable, POST_STATUS } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { generateSlug } from '@/utils/slugify'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const sourceId = url.searchParams.get('source')
  const ref = url.searchParams.get('ref')

  if (!sourceId || !ref) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const db = getBlogDB()

  let post = await db.query.postsTable.findFirst({
    where: eq(postsTable.id, ref),
  })

  if (!post) {
    const candidates = await db
      .select({ id: postsTable.id, title: postsTable.title })
      .from(postsTable)

    const found = candidates.find((p) => generateSlug(p.title || '') === ref)
    if (found) {
      post = await db.query.postsTable.findFirst({ where: eq(postsTable.id, found.id) })
    }
  }

  if (!post) {
    return NextResponse.json({ found: false }, { status: 404 })
  }

  const link = await db.query.postTagTable.findFirst({
    where: and(
      eq(postTagTable.source_post_id, sourceId),
      eq(postTagTable.target_post_id, post.id)
    ),
  })

  if (!link || post.status !== POST_STATUS.APPROVED) {
    return NextResponse.json({ found: false }, { status: 404 })
  }

  const author = await db.query.userTable.findFirst({
    where: eq(userTable.id, post.user_id),
  })
  const authorName =
    author?.nickname || `${author?.firstName || ''} ${author?.lastName || ''}`.trim()

  return NextResponse.json({
    found: true,
    post: {
      id: post.id,
      title: post.title,
      content: post.content,
      authorName,
    },
  })
}
