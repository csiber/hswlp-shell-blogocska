import { NextResponse } from 'next/server';
import { getBlogDB } from '@/db';
import { postCategoryTable, postsTable } from '@/db/schema';
import { requireAdmin } from '@/utils/auth';
import { generateSlug } from '@/utils/slugify';
import { eq, sql } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
  const { id } = await params;
  if (existing && existing.id !== id) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
  }

  await db
    .update(postCategoryTable)
    .set({ name, slug })
    .where(eq(postCategoryTable.id, id));

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin({ doNotThrowError: false });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = getBlogDB();
  const { id } = await params;
  const category = await db.query.postCategoryTable.findFirst({
    where: eq(postCategoryTable.id, id),
  });
  if (!category) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(postsTable)
    .where(eq(postsTable.category, category.slug));

  if (count > 0) {
    return NextResponse.json(
      { error: 'Nem törölhető, mert van hozzárendelt bejegyzés.' },
      { status: 400 },
    );
  }

  await db.delete(postCategoryTable).where(eq(postCategoryTable.id, id));

  return NextResponse.json({ success: true });
}
