"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Search,
  Briefcase,
  BookOpen,
  MessageSquare,
  Calendar,
  Menu,
  LogIn,
  UserPlus,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { useMobile } from "@/hooks/use-mobile"

export default function Navigation() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const routes = [
    {
      name: "Home",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Discover",
      path: "/discover",
      icon: Search,
    },
    {
      name: "Investors",
      path: "/investors",
      icon: Briefcase,
    },
    {
      name: "Resources",
      path: "/resources",
      icon: BookOpen,
    },
    {
      name: "Community",
      path: "/community",
      icon: MessageSquare,
    },
    {
      name: "Events",
      path: "/events",
      icon: Calendar,
    },
  ]

  const NavItems = () => (
    <>
      <div className="flex items-center gap-6 lg:gap-10">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">StartHub</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.path ? "text-primary" : "text-muted-foreground",
                )}
              >
                {route.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="hidden md:flex items-center gap-2">
        {isAuthenticated ? (
          <Link href="/profile">
            <Avatar>
              <AvatarFallback>SH</AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <>
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Sign Up</Button>
            </Link>
          </>
        )}
        <ModeToggle />
      </div>
    </>
  )

  const MobileNavItems = () => (
    <div className="flex flex-col gap-4 pt-4">
      {routes.map((route) => {
        const Icon = route.icon
        return (
          <Link
            key={route.path}
            href={route.path}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              pathname === route.path ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {route.name}
          </Link>
        )
      })}
      <div className="h-px bg-border my-2" />
      {isAuthenticated ? (
        <Link href="/profile" className="flex items-center gap-2 text-sm font-medium">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">SH</AvatarFallback>
          </Avatar>
          Profile
        </Link>
      ) : (
        <>
          <Link href="/sign-in" className="flex items-center gap-2 text-sm font-medium">
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
          <Link href="/sign-up" className="flex items-center gap-2 text-sm font-medium">
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Link>
        </>
      )}
      <div className="mt-2">
        <ModeToggle />
      </div>
    </div>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {isMobile ? (
          <>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">StartHub</span>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <Link href="/" className="flex items-center space-x-2">
                      <span className="text-xl font-bold">StartHub</span>
                    </Link>
                  </div>
                  <MobileNavItems />
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <NavItems />
        )}
      </div>
    </header>
  )
}
