import { AppLayout } from '@/components/layout/app-layout';
import { UserNav } from '@/components/user-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout userNav={<UserNav />}>{children}</AppLayout>;
}
