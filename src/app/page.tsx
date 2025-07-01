"use client";

import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";
import { Home } from 'lucide-react';

export default function RootPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background border-b">
         <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-9 bg-primary text-primary-foreground rounded-lg">
                <Home className="size-5" />
            </Button>
            <h1 className="font-headline text-xl font-semibold">
              Avanti Realty
            </h1>
          </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <UserNav />
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Modern Property Management
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Avanti Realty provides a seamless platform for managing your properties, payments, and maintenance requests.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button size="lg">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
