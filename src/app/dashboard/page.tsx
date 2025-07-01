import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, addMonths, startOfMonth } from "date-fns";

export default function DashboardPage() {
  const nextPaymentDate = startOfMonth(addMonths(new Date(), 1));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's a summary of your account.</p>
      </div>
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
      </div>
    </div>
  );
}
