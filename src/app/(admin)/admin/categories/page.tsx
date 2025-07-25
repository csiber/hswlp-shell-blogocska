import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/utils/auth";
import { getBlogDB } from "@/db";
import type { Metadata } from "next";
import CategoriesClient from "./categories.client";

export const metadata: Metadata = {
  title: "Blog kategóriák",
  description: "Kategóriák kezelése",
};

export default async function CategoriesPage() {
  await requireAdmin();
  const db = getBlogDB();
  const categories = await db.query.postCategoryTable.findMany({
    orderBy: (t, { asc: ascFn }) => [ascFn(t.name)],
  });

  return (
    <>
      <PageHeader items={[{ href: "/admin", label: "Admin" }]} />
      <div className="container mx-auto px-6 pb-10">
        <CategoriesClient initialCategories={categories} />
      </div>
    </>
  );
}
