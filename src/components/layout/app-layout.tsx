"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MessageSquare,
  Settings,
  Wallet,
  Wrench,
  Home,
  CalendarClock,
  Building2,
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
import { NotificationsNav } from "@/components/notifications-nav"

const menuItems = [
  {
    href: "/dashboard/properties",
    icon: Building2,
    label: "Properties",
  },
  {
    href: "/dashboard/payments",
    icon: Wallet,
    label: "Payment History",
  },
  {
    href: "/dashboard/upcoming-payments",
    icon: CalendarClock,
    label: "Upcoming Payments",
  },
  {
    href: "/dashboard/maintenance",
    icon: Wrench,
    label: "Maintenance Requests",
  },
  {
    href: "/dashboard/communications",
    icon: MessageSquare,
    label: "Communications",
  },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const allMenuItems = menuItems

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-9 bg-primary text-primary-foreground rounded-lg">
                <Home className="size-5" />
            </Button>
            <h1 className="font-headline text-xl font-semibold text-sidebar-foreground">
              Avanti Realty
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {allMenuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
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
              <Link href="/dashboard/settings">
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
                <NotificationsNav />
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
