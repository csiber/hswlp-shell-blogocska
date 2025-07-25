import { NextResponse } from 'next/server';
import { getBlogDB } from '@/db';
import { postCategoryTable } from '@/db/schema';
import { requireAdmin } from '@/utils/auth';
import { generateSlug } from '@/utils/slugify';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const session = await requireAdmin({ doNotThrowError: false });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as { name?: string; slug?: string };
  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: 'Missing name' }, { status: 400 });
  }
  const slug = generateSlug((body.slug || name).trim());

  const db = getBlogDB();
  const existing = await db.query.postCategoryTable.findFirst({
    where: eq(postCategoryTable.slug, slug),
  });
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
  }

  const [category] = await db
    .insert(postCategoryTable)
    .values({ name, slug })
    .returning();

  return NextResponse.json(category);
}
