
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
import { useUser } from "@/contexts/user-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { payments, properties } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const nextPaymentDate = startOfMonth(addMonths(new Date(), 1));
  const { user } = useUser();

  const recentPayments = [...payments]
    .sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime())
    .slice(0, 3);

  const getPropertyName = (propertyId: string) => {
    return properties.find((p) => p.id === propertyId)?.name || "Unknown";
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}! Here's a summary of your account.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Current Balance
            </CardTitle>
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
            <CardTitle>Payment History</CardTitle>
            <CardDescription>A summary of your recent payments.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {getPropertyName(payment.propertyId)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(payment.dueDate, "P")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                  <Badge
                    variant={
                      payment.status === "Paid"
                        ? "secondary"
                        : payment.status === "Overdue"
                        ? "destructive"
                        : "default"
                    }
                    className={cn(
                      "capitalize text-xs",
                      payment.status === "Upcoming" &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
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
