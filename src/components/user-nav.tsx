import { cookies } from "next/headers"
import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/server"
import { logout } from "@/lib/actions/auth"
import type { User } from "@/lib/types"

export async function UserNav() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    return (
      <Link href="/login">
        <Button>Sign In</Button>
      </Link>
    )
  }

  // Construct the user object from the authenticated user's data and metadata.
  // This avoids an extra database call to the 'users' table.
  const user: User = {
    id: authUser.id,
    email: authUser.email ?? null,
    name: authUser.user_metadata.name ?? 'Unnamed User',
    avatar_url: authUser.user_metadata.avatar_url ?? null,
    role: authUser.user_metadata.role ?? 'User',
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url ?? undefined} alt={user.name ?? ""} />
            <AvatarFallback>{user.name?.charAt(0) ?? 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={logout}>
          <button type="submit" className="w-full">
            <DropdownMenuItem>
              Log out
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
