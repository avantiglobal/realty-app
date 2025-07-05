"use client"

import Image from "next/image"
import { MoreVertical } from "lucide-react"
import { properties, contracts } from "@/lib/data"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function PropertiesPage() {
  // We find the associated contract for each property to display rent and status.
  const getPropertyDetails = (propertyId: string) => {
    const contract = contracts.find(c => c.propertyId === propertyId && c.status === 'In Progress');
    return {
      rent: contract?.rentAmount,
      status: contract ? 'Occupied' : 'Vacant'
    };
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline">Properties</h1>
            <p className="text-muted-foreground">Manage all your properties in one place.</p>
        </div>
        <Button>
            Add Property
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {properties.map((property) => {
          const { rent, status } = getPropertyDetails(property.id);
          
          return (
            <Card key={property.id} className="overflow-hidden">
              <CardHeader className="p-0">
                  <div className="relative">
                      <Image
                          alt={property.name}
                          className="aspect-video w-full object-cover"
                          height="225"
                          src={property.imageUrl}
                          width="400"
                          data-ai-hint="house apartment"
                      />
                      <div className="absolute top-2 right-2">
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="secondary" className="w-8 h-8">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">More</span>
                              </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </div>
                  </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold">{property.name}</CardTitle>
                      <CardDescription className="text-sm">{property.address}</CardDescription>
                    </div>
                    <Badge variant={status === 'Occupied' ? 'default' : 'secondary'}>{status}</Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm">
                <div className="font-semibold text-primary">
                  {rent ? `$${rent.toLocaleString()}/month` : 'N/A'}
                </div>
                <div className="text-muted-foreground">Owner ID: {property.ownerId}</div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
