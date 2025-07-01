"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function UserNav() {
  return (
    <Link href="/dashboard">
        <Button>Sign In</Button>
    </Link>
  )
}
