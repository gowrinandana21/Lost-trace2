"use client"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MissingPersonDetails } from "@/components/missing-person-details"
import { FamilyContactsTable } from "@/components/family-contacts-table"
import { ReportsTable } from "@/components/reports-table"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Edit } from "lucide-react"

export default function MissingPersonPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const { data: missingPerson, isLoading } = useQuery({
    queryKey: ["missingPerson", id],
    queryFn: async () => {
      const response = await api.get(`/api/missing-persons/${id}`)
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (!missingPerson) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Missing Person Not Found</h2>
          <p className="text-muted-foreground">The requested missing person could not be found.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{missingPerson.name}</h2>
          <Badge
            variant={
              missingPerson.status === "active"
                ? "destructive"
                : missingPerson.status === "found"
                  ? "success"
                  : "secondary"
            }
          >
            {missingPerson.status}
          </Badge>
        </div>
        {user?.role === "admin" && (
          <Button onClick={() => router.push(`/dashboard/missing-persons/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Case
          </Button>
        )}
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {(user?.role === "admin" || user?.role === "officer") && (
            <>
              <TabsTrigger value="family">Family Contacts</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </>
          )}
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <MissingPersonDetails person={missingPerson} />
        </TabsContent>
        {(user?.role === "admin" || user?.role === "officer") && (
          <>
            <TabsContent value="family" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Family Contacts</CardTitle>
                  <CardDescription>Contact information for family members</CardDescription>
                </CardHeader>
                <CardContent>
                  <FamilyContactsTable missingPersonId={id as string} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Police Reports</CardTitle>
                  <CardDescription>Official reports related to this case</CardDescription>
                </CardHeader>
                <CardContent>
                  <ReportsTable missingPersonId={id as string} />
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}

