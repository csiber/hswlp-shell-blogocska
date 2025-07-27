import Link from "next/link";
import type { Route } from "next";
import { PageHeader } from "@/components/page-header";

export default function Page() {
  return (
    <>
      <PageHeader
        items={[
          {
            href: "/dashboard",
            label: "Dashboard",
          },
        ]}
      />
      <div className="flex flex-col gap-4 p-4 pt-0">
        <ul className="grid gap-4 md:grid-cols-3">
          <li className="rounded-xl bg-muted/50 p-6 text-center">
            <Link href="/posts" className="font-medium">
              Bejegyzések
            </Link>
          </li>
          <li className="rounded-xl bg-muted/50 p-6 text-center">
            <Link href="/posts/write" className="font-medium text-accent">
              Új írás
            </Link>
          </li>
          <li className="rounded-xl bg-muted/50 p-6 text-center">
            <Link href={"/dashboard/statistics" as Route} className="font-medium">
              Statisztika
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
