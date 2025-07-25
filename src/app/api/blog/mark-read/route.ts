import { NextResponse } from 'next/server'
import { getBlogDB } from '@/db'
import { postReadTable } from '@/db/schema'
import { getSessionFromCookie } from '@/utils/auth'
import { updateUserCredits } from '@/utils/credits'
import { eq, and } from 'drizzle-orm'
import { getIP } from '@/utils/get-IP'

interface MarkReadRequest {
  post_id: string
  duration_sec: number
}

async function hashString(value: string) {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: Request) {
  const session = await getSessionFromCookie()
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as MarkReadRequest
  if (!body.post_id || !body.duration_sec) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (body.duration_sec < 15) {
    return NextResponse.json({ error: 'Duration too short' }, { status: 400 })
  }

  const ip = await getIP()
  const ipHash = await hashString(ip ?? '')

  const db = getBlogDB()

  const existing = await db.query.postReadTable.findFirst({
    where: and(
      eq(postReadTable.post_id, body.post_id),
      eq(postReadTable.user_id, session.user.id),
      eq(postReadTable.ip_hash, ipHash)
    )
  })

  if (!existing) {
    await db.insert(postReadTable).values({
      post_id: body.post_id,
      user_id: session.user.id,
      ip_hash: ipHash,
      duration_sec: body.duration_sec,
    })
    await updateUserCredits(session.user.id, 1)
  }

  return NextResponse.json({ success: true })
}
