"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { useUser } from "@/contexts/user-context"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
    const { user } = useUser()

  return (
    <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Settings</h1>
            <p className="text-muted-foreground">Manage your account and application settings.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>This is how others will see you on the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                </div>
                 <Button>Update Profile</Button>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <Label>Theme</Label>
                        <p className="text-sm text-muted-foreground">Select the theme for the dashboard.</p>
                    </div>
                    <ThemeToggle />
                </div>
            </CardContent>
        </Card>

    </div>
  )
}
