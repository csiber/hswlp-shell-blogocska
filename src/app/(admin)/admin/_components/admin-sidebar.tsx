"use client"

import { type ComponentType } from "react"
import type { Route } from 'next'
import {
  Users,
  Shield,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
} from "@/components/ui/sidebar"
import { Tag, BarChart3, Home } from "lucide-react"

export type NavItem = {
  title: string
  url: Route
  icon?: ComponentType
}

export type NavMainItem = NavItem & {
  isActive?: boolean
  items?: NavItem[]
}

const adminNavItems: NavMainItem[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin",
    icon: Users,
    isActive: true,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: Tag,
  },
  {
    title: "Statistics",
    url: "/admin/statistics",
    icon: BarChart3,
  },
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="pointer-events-none"
                tooltip="Admin Panel"
              >
                <Shield size={24} />
                <span className="text-lg font-bold">Admin Panel</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavMain items={adminNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
