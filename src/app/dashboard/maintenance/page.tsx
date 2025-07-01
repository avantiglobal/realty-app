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
import { maintenanceRequests as allMaintenanceRequests, properties } from "@/lib/data"
import { cn } from "@/lib/utils"
import { MaintenanceRequestForm } from "@/components/maintenance/request-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format } from "date-fns"
import type { MaintenanceRequest } from "@/lib/types"

export default function MaintenancePage() {
    const [maintenanceRequests, setMaintenanceRequests] = React.useState<MaintenanceRequest[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
      // The maintenance requests data is dynamic, so we load it on the client
      // to avoid hydration mismatch errors.
      setMaintenanceRequests(allMaintenanceRequests);
      setIsLoading(false)
    }, [])

    const getPropertyName = (propertyId: string) => {
        return properties.find(p => p.id === propertyId)?.name || "Unknown"
    }

  return (
    <div className="flex flex-col gap-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Maintenance Requests</h1>
            <p className="text-muted-foreground">Track and submit maintenance requests.</p>
        </div>
      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">All Requests</TabsTrigger>
          <TabsTrigger value="new">Submit New Request</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
            <Card>
                <CardHeader>
                    <CardTitle>Request History</CardTitle>
                    <CardDescription>All submitted maintenance requests are listed here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Property</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date Submitted</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell>
                                </TableRow>
                            ) : maintenanceRequests.length > 0 ? (
                              maintenanceRequests.map((request) => (
                              <TableRow key={request.id}>
                                  <TableCell className="font-medium">{getPropertyName(request.propertyId)}</TableCell>
                                  <TableCell className="text-muted-foreground max-w-sm truncate">{request.description}</TableCell>
                                  <TableCell>{format(request.submittedDate, "P")}</TableCell>
                                  <TableCell className="text-right">
                                  <Badge
                                      variant={request.status === 'Completed' ? 'secondary' : request.status === 'Submitted' ? 'default' : 'outline'}
                                      className={cn('capitalize', request.status === 'In Progress' && 'bg-accent text-accent-foreground')}
                                  >
                                      {request.status}
                                  </Badge>
                                  </TableCell>
                              </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">No maintenance requests found.</TableCell>
                              </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="new">
            <Card>
                 <CardHeader>
                    <CardTitle>New Maintenance Request</CardTitle>
                    <CardDescription>Fill out the form below to submit a new request.</CardDescription>
                </CardHeader>
                <CardContent>
                    <MaintenanceRequestForm />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
