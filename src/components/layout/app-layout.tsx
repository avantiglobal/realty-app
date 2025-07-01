"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  Wallet,
  Wrench,
  Flame,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"

const menuItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/dashboard/properties",
    icon: Building,
    label: "Properties",
  },
  {
    href: "/dashboard/payments",
    icon: Wallet,
    label: "Payments",
  },
  {
    href: "/dashboard/maintenance",
    icon: Wrench,
    label: "Maintenance",
  },
  {
    href: "/dashboard/communications",
    icon: MessageSquare,
    label: "Communications",
  },
]

const adminMenuItems = [
    {
    href: "/dashboard/users",
    icon: Users,
    label: "User Management",
    },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useUser()

  const allMenuItems = user.role === 'Admin' ? [...menuItems, ...adminMenuItems] : menuItems

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-9 bg-primary text-primary-foreground rounded-lg">
                <Flame className="size-5" />
            </Button>
            <h1 className="font-headline text-xl font-semibold text-primary">
              PropTrack Hub
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {allMenuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard/settings" legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/settings"}
                  tooltip="Settings"
                >
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
            <SidebarTrigger className="sm:hidden" />
            <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
                <UserNav />
            </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
