import Link from "next/link"
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

async function getUsers(supabase: ReturnType<typeof createServerClient>) {
  // Using the admin client to fetch all users is the correct and secure way
  // to do this from a server component.
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  if (error) {
    throw error
  }
  return users
}

export default async function UsersPage() {
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
          },
        }
    )
    let users: any[] = []
    let fetchError: string | null = null

    try {
        console.log("✅ Verifying environment variables...");
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          throw new Error("Missing Supabase environment variables.");
        }
        console.log("✅ Supabase environment variables verified.");

        console.log("... Initializing Supabase client ...");
        // The client is already initialized above
        console.log("✅ Supabase client initialized.");

        console.log("... Attempting to fetch users from Supabase ...");
        const fetchedUsers = await getUsers(supabase);
        console.log("✅ Successfully fetched users from Supabase.");

        users = fetchedUsers.map(user => ({
            id: user.id,
            name: user.user_metadata?.name ?? 'No name',
            email: user.email,
            avatar_url: user.user_metadata?.avatar_url,
            role: user.user_metadata?.role ?? 'User',
        }));
    } catch (error: any) {
        // Log the full error for debugging on the server
        console.error("❌ CONNECTION FAILED:", error);
        // Set a user-friendly error message to display in the UI
        fetchError = "Could not fetch users. Please check your terminal console for detailed error messages and verify your connection and environment variables.";
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Users</h1>
                    <p className="text-muted-foreground">Manage all users in the system.</p>
                </div>
                <Link href="/dashboard/users/new">
                    <Button>Add User</Button>
                </Link>
            </div>
            
            {fetchError && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>
                  {fetchError}
                </AlertDescription>
              </Alert>
            )}

          <Card>
              <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>A list of all users including admins and tenants.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {users && users.length > 0 ? (
                            users.map((user: User) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.avatar_url ?? undefined} alt={user.name ?? 'User'} />
                                            <AvatarFallback>{(user.name ?? 'U').charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{user.name ?? 'No name'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                            ))
                          ) : !fetchError ? (
                            <TableRow>
                              <TableCell colSpan={3} className="h-24 text-center">
                                No users found.
                              </TableCell>
                            </TableRow>
                          ) : null}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
        </div>
    )
}
