import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { maintenanceRequests, properties } from "@/lib/data"
import { Wrench } from "lucide-react"

export function RecentRequests() {
    const getProperty = (propertyId: string) => {
        return properties.find(p => p.id === propertyId);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Maintenance</CardTitle>
        <CardDescription>
          {maintenanceRequests.length} active requests.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {maintenanceRequests.slice(0, 4).map(request => (
            <div className="flex items-center justify-between space-x-4" key={request.id}>
                <div className="flex items-center space-x-4">
                    <Avatar className="rounded-md">
                        <AvatarFallback className="rounded-md bg-secondary">
                            <Wrench className="w-4 h-4 text-secondary-foreground" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium leading-none">
                            {getProperty(request.propertyId)?.name}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{request.description}</p>
                    </div>
                </div>
                 <p className="text-sm font-medium text-muted-foreground">{request.status}</p>
            </div>
        ))}
      </CardContent>
    </Card>
  )
}
