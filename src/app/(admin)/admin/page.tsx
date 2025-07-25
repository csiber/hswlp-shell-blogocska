import { PageHeader } from "@/components/page-header"
import { UsersTable } from "./_components/users/users-table"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blogocska – Álmaid naplója",
  description: "Manage all users",
}

export default function AdminPage() {

  return (
    <>
      <PageHeader items={[{ href: "/admin", label: "Admin" }]} />
      <UsersTable />
    </>
  )
}
