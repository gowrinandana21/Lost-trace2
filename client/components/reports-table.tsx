"use client"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth-context"
import { Edit, FileText, Plus, Trash } from "lucide-react"

interface ReportsTableProps {
  missingPersonId: string
}

export function ReportsTable({ missingPersonId }: ReportsTableProps) {
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ["reports", missingPersonId],
    queryFn: async () => {
      const response = await api.get("/api/reports", {
        params: { missingPersonId },
      })
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Police Report #</TableHead>
                <TableHead>Record #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No reports found.</p>
          {(user?.role === "admin" || user?.role === "officer") && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Report
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {(user?.role === "admin" || user?.role === "officer") && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Report
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Police Report #</TableHead>
              <TableHead>Record #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((report: any) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.policeReportNumber}</TableCell>
                <TableCell>{report.recordNumber || "N/A"}</TableCell>
                <TableCell>{new Date(report.reportDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    {(user?.role === "admin" || user?.role === "officer") && (
                      <>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        {user?.role === "admin" && (
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

