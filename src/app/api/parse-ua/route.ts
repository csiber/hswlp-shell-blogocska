import { NextResponse } from 'next/server'
import { lazyImport } from '@/utils/lazy-import'
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(request: Request) {
  const { ua } = (await request.json()) as { ua: string | null | undefined }
  const { UAParser } = await lazyImport('ua-parser-' + 'js') as any
  const result = new UAParser(ua ?? '').getResult()
  return NextResponse.json(result)
}
/* eslint-enable @typescript-eslint/no-explicit-any */
