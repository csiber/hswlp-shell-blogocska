import { NextResponse } from 'next/server'
import { getBlogDB } from '@/db'
import { postsTable, moderationLogTable, POST_STATUS, MOD_ACTION } from '@/db/schema'
import { requireAdmin } from '@/utils/auth'
import { eq } from 'drizzle-orm'

interface ModerateRequest {
  post_id: string
  action: 'approve' | 'reject' | 'delete'
  note?: string | null
}

export async function POST(request: Request) {
  const session = await requireAdmin({ doNotThrowError: false })
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as ModerateRequest
  if (!body.post_id || !body.action) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const db = getBlogDB()

  if (body.action === 'approve') {
    await db.update(postsTable).set({ status: POST_STATUS.APPROVED }).where(eq(postsTable.id, body.post_id))
  } else if (body.action === 'reject') {
    await db.update(postsTable).set({ status: POST_STATUS.REJECTED }).where(eq(postsTable.id, body.post_id))
  } else if (body.action === 'delete') {
    await db.delete(postsTable).where(eq(postsTable.id, body.post_id))
  }

  await db.insert(moderationLogTable).values({
    post_id: body.post_id,
    moderator_id: session.user.id,
    action: body.action as typeof MOD_ACTION[keyof typeof MOD_ACTION],
    note: body.note ?? null,
  })

  return NextResponse.json({ success: true })
}
