import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/utils/auth";
import { getBlogDB } from "@/db";
import { userTable, postsTable } from "@/db/schema";
import { sql } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statisztika",
  description: "Rendszer statisztikák",
};

export default async function StatisticsPage() {
  await requireAdmin();
  const db = getBlogDB();

  const [{ userCount }] = await db
    .select({ userCount: sql<number>`cast(count(${userTable.id}) as int)` })
    .from(userTable);

  const [{ postCount }] = await db
    .select({ postCount: sql<number>`cast(count(${postsTable.id}) as int)` })
    .from(postsTable);

  return (
    <>
      <PageHeader items={[{ href: "/admin", label: "Admin" }]} />
      <div className="container mx-auto px-6 pb-10 space-y-4">
        <h1 className="text-3xl font-bold mb-6">Statisztika</h1>
        <p>Felhasználók száma: {userCount}</p>
        <p>Posztok száma: {postCount}</p>
      </div>
    </>
  );
}
