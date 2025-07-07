import Link from "next/link"
import { cookies } from "next/headers"
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
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export default async function UsersPage() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
        redirect('/login')
    }

    let users: User[] | null = null;
    let fetchError: string | null = null;
    
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceRoleKey) {
            throw new Error("Server configuration error: Supabase keys not set.");
        }
        
        const supabaseAdmin = createAdminClient(
            supabaseUrl,
            supabaseServiceRoleKey,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );

        const { data: { users: authUsers }, error } = await supabaseAdmin.auth.admin.listUsers();
        
        if (error) {
            throw error;
        }
        
        // Map the Supabase Auth users to our application's User type
        users = authUsers.map(user => ({
            id: user.id,
            name: user.user_metadata.name ?? 'No name provided',
            email: user.email ?? 'No email',
            avatar_url: user.user_metadata.avatar_url ?? null,
            role: user.user_metadata.role ?? 'User',
        }));

    } catch (error: any) {
        console.error("❌ Error fetching users:", error);
        fetchError = "Could not fetch the full user list due to a connection error. Only the current user is being displayed.";
    }

    if (fetchError) {
        // Fallback to showing only the current authenticated user.
        users = [{
            id: authUser.id,
            name: authUser.user_metadata.name ?? 'Current User',
            email: authUser.email ?? 'No email',
            avatar_url: authUser.user_metadata.avatar_url ?? null,
            role: authUser.user_metadata.role ?? 'User',
        }]
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
                <AlertTitle>Connection Issue</AlertTitle>
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
                            users.map((user) => (
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
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="h-24 text-center">
                                No users found.
                              </TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
        </div>
    )
}
