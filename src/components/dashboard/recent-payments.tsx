"use client"

import * as React from "react"
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { payments, properties } from "@/lib/data"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Payment } from "@/lib/types"

export function RecentPayments() {
  const [recentPayments, setRecentPayments] = React.useState<Payment[]>([])

  React.useEffect(() => {
    // The payments data is dynamic, so we load it on the client
    // to avoid hydration mismatch errors.
    setRecentPayments(payments.slice(0, 5))
  }, [])

  const getPropertyName = (propertyId: string) => {
    return properties.find(p => p.id === propertyId)?.name || "Unknown Property"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Upcoming & Recent Payments</CardTitle>
        <CardDescription>
          A quick look at payment statuses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentPayments.length > 0 ? (
              recentPayments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="font-medium">{getPropertyName(payment.propertyId)}</div>
                    <div className="text-sm text-muted-foreground">{format(payment.dueDate, "P")}</div>
                  </TableCell>
                  <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={payment.status === 'Paid' ? 'secondary' : payment.status === 'Overdue' ? 'destructive' : 'default'}
                      className={cn(payment.status === 'Upcoming' && 'bg-accent text-accent-foreground')}
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
               <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
