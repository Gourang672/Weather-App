"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b bg-background dark:bg-olive-900">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold">
          Weather App
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <div className="hidden md:flex space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="bg-neutral-100 dark:bg-neutral-800">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Sign Up</Button>
          </Link>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] [&>button]:hidden">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-4"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
            <div className="flex flex-col space-y-6 pt-12 px-6">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full justify-start h-14 text-base font-medium border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button className="w-full justify-start h-14 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg">
                  Sign Up
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}