"use client";

import * as React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, addMonths, startOfMonth } from "date-fns";
import { useUser } from "@/contexts/user-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { payments as allPayments } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Payment } from "@/lib/types";

export default function DashboardPage() {
  const [nextPaymentDate, setNextPaymentDate] = React.useState<Date | null>(null);
  const [recentPayments, setRecentPayments] = React.useState<Payment[]>([]);
  const { user } = useUser();

  React.useEffect(() => {
    // The date and payment data is dynamic, so we load it on the client
    // to avoid hydration mismatch errors.
    setNextPaymentDate(startOfMonth(addMonths(new Date(), 1)));
    const sortedPayments = [...allPayments]
      .sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime())
      .slice(0, 3);
    setRecentPayments(sortedPayments);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}! Here's a summary of your account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-4 flex flex-row gap-4 items-center">
                <Image
                    alt="Property Image"
                    className="aspect-[3/2] w-1/3 object-cover rounded-md"
                    height="64"
                    src="https://placehold.co/96x64.png"
                    width="96"
                    data-ai-hint="house apartment"
                />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">1546 Moose Ridge Ln</h3>
                    <p className="text-muted-foreground text-sm">Westfield, IN, 46074</p>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">$2,650</p>
              {nextPaymentDate ? (
                 <p className="text-muted-foreground mt-1">
                  Due on {format(nextPaymentDate, "MMMM d, yyyy")}
                 </p>
              ) : (
                  <div className="h-6 w-40 bg-muted rounded animate-pulse mt-1" />
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>A summary of your recent payments.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
             {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                    <div
                        key={payment.id}
                        className="flex items-center justify-between"
                    >
                        <div>
                        <p className="font-medium">
                           Rent Payment
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {format(payment.dueDate, "P")}
                        </p>
                        </div>
                        <div className="text-right">
                        <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                        <Badge
                            variant={
                                payment.status === 'Overdue'
                                ? 'destructive'
                                : 'default'
                            }
                            className={cn(
                            "capitalize text-xs",
                            payment.status === 'Upcoming' &&
                                "bg-accent text-accent-foreground",
                            payment.status === 'Paid' &&
                                "bg-green-600 text-white border-transparent hover:bg-green-700"
                            )}
                        >
                            {payment.status}
                        </Badge>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-sm text-muted-foreground text-center pt-8">Loading payments...</div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/payments" className="w-full">
              <Button className="w-full">
                View Full History <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
