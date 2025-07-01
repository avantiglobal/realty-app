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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { payments as allPayments, properties } from "@/lib/data"
import { Payment } from "@/lib/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

function PaymentsTable({ payments }: { payments: Payment[] }) {
    const getPropertyName = (propertyId: string) => {
        return properties.find(p => p.id === propertyId)?.name || "Unknown"
    }

  return (
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
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-medium">{getPropertyName(payment.propertyId)}</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>{format(payment.dueDate, "P")}</TableCell>
            <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              <Badge
                variant={payment.status === 'Paid' ? 'secondary' : payment.status === 'Overdue' ? 'destructive' : 'default'}
                className={cn('capitalize', payment.status === 'Upcoming' && 'bg-accent text-accent-foreground')}
              >
                {payment.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<Payment[]>([]);

  React.useEffect(() => {
    // The payments data is dynamic, so we load it on the client
    // to avoid hydration mismatch errors.
    setPayments(allPayments);
  }, []);

  const upcomingPayments = payments.filter(p => p.status === 'Upcoming');
  const overduePayments = payments.filter(p => p.status === 'Overdue');
  const paidPayments = payments.filter(p => p.status === 'Paid');

  return (
    <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Payments</h1>
            <p className="text-muted-foreground">Track and manage all payments.</p>
        </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <PaymentsTable payments={payments} />
        </TabsContent>
        <TabsContent value="upcoming">
          <PaymentsTable payments={upcomingPayments} />
        </TabsContent>
        <TabsContent value="overdue">
          <PaymentsTable payments={overduePayments} />
        </TabsContent>
        <TabsContent value="paid">
          <PaymentsTable payments={paidPayments} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
