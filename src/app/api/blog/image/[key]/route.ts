import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { env } = getCloudflareContext()
  const { key } = await params
  const r2 = (env as unknown as { blogocska_r2: R2Bucket }).blogocska_r2

  const obj = await r2.get(key)
  if (!obj) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(obj.body, {
    headers: {
      'content-type': obj.httpMetadata?.contentType || 'application/octet-stream',
    },
  })
}
