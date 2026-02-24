"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"

export function ConditionalNavbar() {
  const pathname = usePathname()

  // Don't show navbar on dashboard and admin pages
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null
  }

  return <Navbar />
}