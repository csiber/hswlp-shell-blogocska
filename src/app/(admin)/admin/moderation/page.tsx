import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/utils/auth";
import { getBlogDB } from "@/db";
import { postsTable, POST_STATUS } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import ModerationClient from "./moderation.client";
import { getUserDisplayName } from "@/utils/user";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogocska – Álmaid naplója",
  description: "Pending posts moderation",
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ModerationPage({ searchParams }: Props) {
  await requireAdmin();
  const db = getBlogDB();
  const whereClauses = [eq(postsTable.status, POST_STATUS.PENDING)];
  const params = await searchParams;
  if (params?.category) {
    whereClauses.push(eq(postsTable.category, params.category));
  }

  const rows = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      content: postsTable.content,
      userId: postsTable.user_id,
      category: postsTable.category,
      createdAt: postsTable.created_at,
    })
    .from(postsTable)
    .where(and(...whereClauses))
    .orderBy(asc(postsTable.created_at))
    .limit(100);

  const posts = await Promise.all(
    rows.map(async (row) => ({
      ...row,
      authorName: await getUserDisplayName(row.userId),
    })),
  );

  return (
    <>
      <PageHeader items={[{ href: "/admin", label: "Admin" }]} />
      <div className="container mx-auto px-6 pb-10">
        <h1 className="text-3xl font-bold mb-6">Moderation</h1>
        <ModerationClient initialPosts={posts} />
      </div>
    </>
  );
}
