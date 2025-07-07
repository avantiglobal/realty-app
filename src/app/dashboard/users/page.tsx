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
import { users } from "@/lib/data" // Import mock data
import type { User } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

// This page now uses mock data to bypass the Supabase connection issue.
// The original server component logic is commented out below for reference.
export default function UsersPage() {
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
            
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Modo de Demostración</AlertTitle>
                <AlertDescription>
                  La aplicación está usando datos de prueba debido a un problema de conexión con la base de datos. La funcionalidad de Supabase está desactivada temporalmente.
                </AlertDescription>
              </Alert>

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