import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Wallet, CalendarClock, Wrench, MessageSquare, Building2 } from "lucide-react";

const dashboardOptions = [
  {
    href: "/dashboard/properties",
    icon: Building2,
    label: "Properties",
    description: "View and manage your properties.",
  },
  {
    href: "/dashboard/payments",
    icon: Wallet,
    label: "Payment History",
    description: "View transaction history and past payments.",
  },
  {
    href: "/dashboard/upcoming-payments",
    icon: CalendarClock,
    label: "Upcoming Payments",
    description: "Check for upcoming and due payments.",
  },
  {
    href: "/dashboard/maintenance",
    icon: Wrench,
    label: "Maintenance Requests",
    description: "Submit and track maintenance requests.",
  },
  {
    href: "/dashboard/communications",
    icon: MessageSquare,
    label: "Communications",
    description: "Contact support or your property manager.",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Select an option to get started.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardOptions.map((option) => (
          <Link href={option.href} key={option.href} className="group flex">
            <Card className="flex flex-col w-full transition-all group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1 p-4">
              <CardHeader>
                <div className="bg-primary text-primary-foreground rounded-lg p-3 w-fit">
                  <option.icon className="h-7 w-7" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <CardTitle className="text-lg font-semibold">{option.label}</CardTitle>
                <CardDescription className="mt-2 text-sm">{option.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
