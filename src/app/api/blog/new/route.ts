import { NextResponse } from 'next/server'
import { getBlogDB } from '@/db'
import { postsTable, POST_STATUS } from '@/db/schema'
import { postTagTable } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { generateSlug } from '@/utils/slugify'
import { getSessionFromCookie } from '@/utils/auth'
import { getUserCredits, consumeCredits } from '@/utils/credits'

interface NewPostRequest {
  title: string
  content: string
  category: string
  image_url?: string | null
}

export async function POST(request: Request) {
  const session = await getSessionFromCookie()
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as NewPostRequest
  if (!body.title || !body.content || !body.category) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const registeredAt = new Date(session.user.createdAt)
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000
  if (Date.now() - registeredAt.getTime() < threeDaysMs) {
    return NextResponse.json({ error: 'To post, you need at least a 3-day account.' }, { status: 403 })
  }

  if (session.user.role !== 'admin') {
    const credits = await getUserCredits(session.user.id)
    if (credits < 1) {
      return NextResponse.json({ error: 'Not enough credits' }, { status: 403 })
    }
  }

  const db = getBlogDB()
  const [post] = await db
    .insert(postsTable)
    .values({
      user_id: session.user.id,
      title: body.title,
      content: body.content,
      category: body.category,
      status: POST_STATUS.PENDING,
      image_url: body.image_url ?? null,
    })
    .returning({ id: postsTable.id })

  const mentionRegex = /@([a-zA-Z0-9_-]{3,32})/g
  const matches = new Set<string>()
  for (const m of body.content.matchAll(mentionRegex)) {
    matches.add(m[1])
  }

  for (const ref of matches) {
    let target = await db.query.postsTable.findFirst({ where: eq(postsTable.id, ref) })
    if (!target) {
      const candidates = await db
        .select({ id: postsTable.id, title: postsTable.title })
        .from(postsTable)
      const found = candidates.find(p => generateSlug(p.title || '') === ref)
      if (found) {
        target = await db.query.postsTable.findFirst({ where: eq(postsTable.id, found.id) })
      }
    }
    if (target) {
      const existing = await db.query.postTagTable.findFirst({
        where: and(
          eq(postTagTable.source_post_id, post.id),
          eq(postTagTable.target_post_id, target.id)
        ),
      })
      if (!existing) {
        await db.insert(postTagTable).values({
          source_post_id: post.id,
          target_post_id: target.id,
        })
      }
    }
  }

  if (session.user.role !== 'admin') {
    try {
      await consumeCredits({
        userId: session.user.id,
        amount: 1,
        description: 'Create blog post',
      })
    } catch (err) {
  console.warn('Credit consumption failed', err)
}

  }

  return NextResponse.json({ id: post.id })
}
