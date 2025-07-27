import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { POST_STATUS } from '@/db/schema'

interface BlogPostRow {
  id: string
  title: string | null
  content: string | null
  image_url: string | null
  created_at: string
  user_id: string
  author_first: string | null
  author_nick: string | null
  author_last: string | null
  category_name: string | null
}

export async function GET(request: Request) {
  try {
    const { env } = getCloudflareContext()

    if (!env.DB) {
      console.error('env.DB is not bound')
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limitEnv = env.POST_COUNT ? parseInt(env.POST_COUNT as string, 10) : undefined
    const limitParam = parseInt(url.searchParams.get('limit') || '20', 10)
    const limit = limitEnv && limitEnv > 0 ? Math.min(limitParam, limitEnv) : limitParam
    const offset = (page - 1) * limit

    const stmt = env.DB.prepare(`
      SELECT p.id, p.title, p.content, p.image_url, p.created_at, p.user_id,
             u.firstName as author_first, u.nickname as author_nick,
             u.lastName as author_last, c.name as category_name
      FROM posts p
      LEFT JOIN user u ON p.user_id = u.id
      LEFT JOIN post_category c ON p.category = c.slug
      WHERE p.status = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `)

    const { results } = await stmt.bind(POST_STATUS.APPROVED, limit, offset).all<BlogPostRow>()

    console.log('Feed query result', results)
    if (env.POST_COUNT) {
      console.log('POST_COUNT', env.POST_COUNT)
    }

    const transformed = (results || []).map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      imageUrl: p.image_url,
      createdAt: p.created_at,
      authorName: p.author_nick || `${p.author_first || ''} ${p.author_last || ''}`.trim(),
      category: p.category_name,
    }))

    return NextResponse.json({ posts: transformed })
  } catch (err) {
    console.error('Feed query failed', err)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
