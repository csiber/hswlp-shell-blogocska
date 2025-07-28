"use client"

import { type ComponentType } from "react"
import type { Route } from 'next'

import {
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSessionStore } from "@/state/session"

export type NavItem = {
  title: string
  url: Route
  icon?: ComponentType
}

export type NavMainItem = NavItem & {
  isActive?: boolean
  items?: NavItem[]
}

type Data = {
  user: {
    name: string
    email: string
  }
  navMain: NavMainItem[]
  projects: NavItem[]
}

// TODO Add a theme switcher
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { session } = useSessionStore();

  const data: Data = {
    user: {
      name: session?.user?.nickname || session?.user?.firstName || "User",
      email: session?.user?.email || "user@example.com",
    },
    navMain: [
      {
        title: "Vezérlőpult",
        url: "/dashboard",
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "Beállítások",
        url: "/settings",
        icon: Settings2,
        items: [
          {
            title: "Profil",
            url: "/settings",
          },
          {
            title: "Biztonság",
            url: "/settings/security",
          },
          {
            title: "Munkamenetek",
            url: "/settings/sessions",
          },
          {
            title: "Jelszó módosítása",
            url: "/forgot-password",
          },
        ],
      },
    ],
    projects: [
      {
        title: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        title: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        title: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>


      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
