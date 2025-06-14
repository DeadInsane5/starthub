"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/app/auth-context";

export default function Navigation() {
  const pathname = usePathname();
  const isMobile = useMobile();
  const { session, profile, signOut, isLoading } = useAuth();

  const routes = [
    { name: "Home", path: "/", icon: LayoutDashboard },
    { name: "Discover", path: "/discover", icon: Search },
    { name: "Investors", path: "/investors", icon: Briefcase },
    { name: "Resources", path: "/resources", icon: BookOpen },
    { name: "Community", path: "/community", icon: MessageSquare },
    { name: "Events", path: "/events", icon: Calendar },
  ];

  const NavItems = () => (
    <>
      <div className="flex items-center gap-6 lg:gap-10">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">StartHub</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {routes.map((route) => {
            const Icon = route.icon;
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
            );
          })}
        </nav>
      </div>
      <div className="hidden md:flex items-center gap-2">
        {isLoading ? (
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        ) : session ? (
          <>
            <Link href="/profile">
              <Avatar className="h-8 w-8">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile.name || "User"} />
                ) : (
                  <AvatarFallback>
                    {profile?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await signOut();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </>
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
  );

  const MobileNavItems = () => (
    <div className="flex flex-col gap-4 pt-4">
      {routes.map((route) => {
        const Icon = route.icon;
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
        );
      })}
      <div className="h-px bg-border my-2" />
      {isLoading ? (
        <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
      ) : session ? (
        <>
          <Link href="/profile" className="flex items-center gap-2 text-sm font-medium">
            <Avatar className="h-6 w-6">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.name || "User"} />
              ) : (
                <AvatarFallback className="text-xs">
                  {profile?.name?.slice(0, 2).toUpperCase() || "SH"}
                </AvatarFallback>
              )}
            </Avatar>
            Profile
          </Link>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-sm font-medium justify-start"
            onClick={async () => {
              await signOut();
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </>
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
  );

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
  );
}
