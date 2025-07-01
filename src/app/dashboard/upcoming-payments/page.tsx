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
import { Badge } from "@/components/ui/badge"
import { payments as allPayments, properties } from "@/lib/data"
import { Payment } from "@/lib/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"

export default function UpcomingPaymentsPage() {
  const [upcomingPayments, setUpcomingPayments] = React.useState<Payment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // The payments data is dynamic, so we load it on the client
    // to avoid hydration mismatch errors.
    const upcoming = allPayments.filter(p => p.status === 'Upcoming');
    setUpcomingPayments(upcoming);
    setIsLoading(false);
  }, []);

  const getPropertyName = (propertyId: string) => {
    return properties.find(p => p.id === propertyId)?.name || "Unknown"
  }

  return (
    <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Upcoming Payments</h1>
            <p className="text-muted-foreground">A list of all upcoming payments.</p>
        </div>
        <Card>
            <CardContent className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">Loading...</TableCell>
                            </TableRow>
                        ) : upcomingPayments.length > 0 ? (
                            upcomingPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                <TableCell className="font-medium">{getPropertyName(payment.propertyId)}</TableCell>
                                <TableCell>John Doe</TableCell> 
                                <TableCell>{format(payment.dueDate, "P")}</TableCell>
                                <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <Badge
                                    variant='default'
                                    className='capitalize bg-accent text-accent-foreground'
                                    >
                                    {payment.status}
                                    </Badge>
                                </TableCell>
                                </TableRow>
                            ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                            No upcoming payments.
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
