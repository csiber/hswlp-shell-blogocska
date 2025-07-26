import { NextResponse } from 'next/server'
import { z } from 'zod'
import { SITE_URL } from '@/constants'
import { sendBugReportEmail } from '@/utils/email'
import { withRateLimit, RATE_LIMITS } from '@/utils/with-rate-limit'

const schema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email().max(255).optional(),
  description: z.string().min(1).max(10000),
  screenshotKey: z.string().optional(),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const { name, email, description, screenshotKey } = parsed.data
  const screenshotUrl = screenshotKey
    ? `${SITE_URL}/api/bug-report/image/${screenshotKey}`
    : undefined

  return withRateLimit(
    async () => {
      await sendBugReportEmail({ name, email, description, screenshotUrl })
      return NextResponse.json({ success: true })
    },
    RATE_LIMITS.EMAIL
  )
}
