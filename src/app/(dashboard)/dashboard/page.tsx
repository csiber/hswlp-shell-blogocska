import Link from "next/link";
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
            <Link href="/me" className="font-medium">
              Saját posztok
            </Link>
          </li>
          <li className="rounded-xl bg-muted/50 p-6 text-center">
            <Link href="/write" className="font-medium">
              Új írás
            </Link>
          </li>
          <li className="rounded-xl bg-muted/50 p-6 text-center">
            <Link href="/dashboard/statistics" className="font-medium">
              Statisztika
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
