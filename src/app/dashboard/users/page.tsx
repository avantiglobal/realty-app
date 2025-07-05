import Link from "next/link"
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
import { createClient } from "@supabase/supabase-js"

export default async function UsersPage() {
    let users: User[] | null = null;
    let fetchError: string | null = null;
    
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceRoleKey) {
            throw new Error('Supabase URL and/or Service Role Key are not defined. Please check your .env file.');
        }
    
        const supabaseAdmin = createClient(
            supabaseUrl,
            supabaseServiceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // We explicitly await the response from the server here.
        const { data, error } = await supabaseAdmin.from("users").select("*");
        
        if (error) {
            // Throw the error to be caught by the catch block
            throw error;
        }
        
        users = data;
    } catch (error: any) {
        // Log the full error for debugging on the server
        console.error("❌ CONNECTION FAILED:", error.message);
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
                          {fetchError ? (
                            <TableRow>
                              <TableCell colSpan={3} className="h-24 text-center text-destructive">
                                {fetchError}
                              </TableCell>
                            </TableRow>
                          ) : users && users.length > 0 ? (
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
