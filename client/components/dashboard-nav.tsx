"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { FileText, Home, Search, Users, UserCircle, Settings } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/missing-persons",
      label: "Missing Persons",
      icon: Search,
      active: pathname.includes("/dashboard/missing-persons"),
    },
  ]

  if (user?.role === "admin" || user?.role === "officer") {
    routes.push({
      href: "/dashboard/reports",
      label: "Reports",
      icon: FileText,
      active: pathname.includes("/dashboard/reports"),
    })
  }

  if (user?.role === "admin") {
    routes.push({
      href: "/dashboard/officers",
      label: "Officers",
      icon: UserCircle,
      active: pathname.includes("/dashboard/officers"),
    })
    routes.push({
      href: "/dashboard/users",
      label: "Users",
      icon: Users,
      active: pathname.includes("/dashboard/users"),
    })
  }

  routes.push({
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    active: pathname.includes("/dashboard/settings"),
  })

  return (
    <nav className="grid items-start px-4 py-4">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            route.active ? "bg-muted font-medium text-primary" : "text-muted-foreground",
          )}
        >
          <route.icon className="h-4 w-4" />
          {route.label}
        </Link>
      ))}
    </nav>
  )
}

