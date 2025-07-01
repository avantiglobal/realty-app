"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, addMonths, startOfMonth } from "date-fns";
import { OccupancyChart } from "@/components/dashboard/occupancy-chart";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentPayments } from "@/components/dashboard/recent-payments";
import { RecentRequests } from "@/components/dashboard/recent-requests";
import { useUser } from "@/contexts/user-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const nextPaymentDate = startOfMonth(addMonths(new Date(), 1));
  const { user } = useUser();
  const isAdmin = user.role === 'Admin';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}! Here's a summary of your account.
        </p>
      </div>

      {isAdmin ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">$2,650</p>
                <p className="text-muted-foreground mt-1">
                  Due on {format(nextPaymentDate, "MMMM d, yyyy")}
                </p>
              </CardContent>
            </Card>
            <OccupancyChart />
            <div className="lg:col-span-2">
                <RecentRequests />
            </div>
            <div className="col-span-full">
                <OverviewChart />
            </div>
            <div className="col-span-full">
                <RecentPayments />
            </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Current Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">$2,650</p>
                    <p className="text-muted-foreground mt-1">
                    Due on {format(nextPaymentDate, "MMMM d, yyyy")}
                    </p>
                </CardContent>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Upcoming Payments</CardTitle>
                    <CardDescription>View your upcoming payment and history.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1" />
                <CardFooter>
                     <Link href="/dashboard/upcoming-payments" className="w-full">
                        <Button className="w-full">
                            View Payments <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Maintenance</CardTitle>
                    <CardDescription>Submit and track maintenance requests.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1" />
                <CardFooter>
                     <Link href="/dashboard/maintenance" className="w-full">
                        <Button className="w-full">
                            View Requests <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
      )}
    </div>
  );
}
