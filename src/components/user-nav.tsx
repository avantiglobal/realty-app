"use client"

import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function UserNav() {
  return (
    <>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">
            <Button>Sign In</Button>
        </Link>
      </SignedOut>
    </>
  )
}
