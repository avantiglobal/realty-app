"use client"

import { useUser } from "@/contexts/user-context"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { RecentPayments } from "@/components/dashboard/recent-payments"
import { RecentRequests } from "@/components/dashboard/recent-requests"
import { OccupancyChart } from "@/components/dashboard/occupancy-chart"

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Welcome back, {user.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Here's a snapshot of your properties today.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <OverviewChart />
            </div>
            <OccupancyChart />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <div className="lg:col-span-2">
                <RecentPayments />
            </div>
            <RecentRequests />
        </div>
    </div>
  )
}
