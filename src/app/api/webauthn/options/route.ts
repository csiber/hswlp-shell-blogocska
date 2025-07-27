import { NextResponse } from 'next/server'
import { getDB } from '@/db'
import { passKeyCredentialTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import isProd from '@/utils/is-prod'
import { SITE_NAME, SITE_DOMAIN } from '@/constants'
import { requireVerifiedEmail } from '@/utils/auth'
import { lazyImport } from '@/utils/lazy-import'
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AuthenticatorTransport } from '@simplewebauthn/types'

const rpName = SITE_NAME
const rpID = isProd ? SITE_DOMAIN : 'localhost'

export async function POST() {
  const session = await requireVerifiedEmail()

  if (!session) {
    throw new Error('Not authenticated')
  }

  const { generateRegistrationOptions } = await lazyImport('@simplewebauthn/' + 'server') as any

  const db = getDB()
  const existingCredentials = await db.query.passKeyCredentialTable.findMany({
    where: eq(passKeyCredentialTable.userId, session.user.id),
  })

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: Buffer.from(session.user.id),
    userName: session.user.email!,
    attestationType: 'none',
    excludeCredentials: existingCredentials.map((cred) => ({
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
