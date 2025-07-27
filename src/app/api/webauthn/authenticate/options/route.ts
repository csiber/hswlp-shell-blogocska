import { NextResponse } from 'next/server'
import { getDB } from '@/db'
import { passKeyCredentialTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import isProd from '@/utils/is-prod'
import { SITE_DOMAIN } from '@/constants'
import { requireVerifiedEmail } from '@/utils/auth'
import { lazyImport } from '@/utils/lazy-import'
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AuthenticatorTransport } from '@simplewebauthn/types'

const rpID = isProd ? SITE_DOMAIN : 'localhost'

export async function POST() {
  const session = await requireVerifiedEmail()

  if (!session) {
    throw new Error('Not authenticated')
  }
  const { generateAuthenticationOptions } = await lazyImport('@simplewebauthn/' + 'server') as any

  const db = getDB()
  const credentials = await db.query.passKeyCredentialTable.findMany({
    where: eq(passKeyCredentialTable.userId, session.user.id),
  })

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: credentials.map((cred) => ({
      id: cred.credentialId,
      type: 'public-key',
      transports: cred.transports
        ? (JSON.parse(cred.transports) as AuthenticatorTransport[])
        : undefined,
    })),
  })

  return NextResponse.json(options)
}
/* eslint-enable @typescript-eslint/no-explicit-any */
