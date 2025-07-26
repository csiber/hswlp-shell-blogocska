import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { requireVerifiedEmail } from '@/utils/auth'
import { init } from '@paralleldrive/cuid2'

const createId = init({ length: 32 })

export async function POST(req: Request) {
  const session = await requireVerifiedEmail({ doNotThrowError: false })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.arrayBuffer()
  if (!data.byteLength) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }

  const { env } = getCloudflareContext()
  const r2 = (env as unknown as { blogocska_r2: R2Bucket }).blogocska_r2
  const key = `img_${createId()}`

  await r2.put(key, data)

  return NextResponse.json({ key, url: `/api/blog/image/${key}` })
}
