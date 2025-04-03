"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardNav } from "@/components/dashboard-nav"
import { Menu } from "lucide-react"

export function MobileDashboardNav() {
  const { user } = useAuth()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Missing Persons Database</h2>
          <p className="text-sm text-muted-foreground">Logged in as {user?.username}</p>
        </div>
        <DashboardNav />
      </SheetContent>
    </Sheet>
  )
}

