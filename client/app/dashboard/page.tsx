"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MissingPersonsTable } from "@/components/missing-persons-table"
import { DashboardStats } from "@/components/dashboard-stats"
import { MobileDashboardNav } from "@/components/mobile-dashboard-nav"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <MobileDashboardNav />
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="missing-persons">Missing Persons</TabsTrigger>
          {(user?.role === "admin" || user?.role === "officer") && <TabsTrigger value="reports">Reports</TabsTrigger>}
          {user?.role === "admin" && <TabsTrigger value="users">Users</TabsTrigger>}
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DashboardStats />
          <Card>
            <CardHeader>
              <CardTitle>Recent Missing Persons</CardTitle>
              <CardDescription>Recently added missing persons cases</CardDescription>
            </CardHeader>
            <CardContent>
              <MissingPersonsTable limit={5} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="missing-persons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Missing Persons</CardTitle>
              <CardDescription>Complete list of missing persons cases</CardDescription>
            </CardHeader>
            <CardContent>
              <MissingPersonsTable />
            </CardContent>
          </Card>
        </TabsContent>
        {(user?.role === "admin" || user?.role === "officer") && (
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Police reports for missing persons cases</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Reports content will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {user?.role === "admin" && (
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>Manage system users and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <p>User management content will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

