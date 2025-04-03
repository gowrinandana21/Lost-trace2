"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, MapPin } from "lucide-react"

export function MissingPersonsList() {
  const [page, setPage] = useState(1)

  interface MissingPerson {
    id: string;
    name: string;
    photo?: string;
    status: "active" | "found" | "unknown";
    lastSeenLocation: string;
    dateLastSeen: string;
    description?: string;
  }

  interface MissingPersonsResponse {
    items: MissingPerson[];
    hasMore: boolean;
  }

  const { data, isLoading, isPreviousData } = useQuery<MissingPersonsResponse>({
    queryKey: ["missingPersons", page],
    queryFn: async () => {
      const response = await api.get("/api/missing-persons", {
        params: { page, limit: 6 },
      })
      return response.data
    },
    keepPreviousData: true,
  })

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No missing persons found</h3>
        <p className="text-muted-foreground">There are currently no missing persons in the database.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((person: any) => (
          <Card key={person.id} className="overflow-hidden flex flex-col">
            <div className="aspect-[4/3] relative bg-muted">
              {person.photo ? (
                <img
                  src={person.photo || "/placeholder.svg"}
                  alt={person.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">No photo available</div>
              )}
              <Badge
                className="absolute top-2 right-2"
                variant={
                  person.status === "active" ? "destructive" : person.status === "found" ? "success" : "secondary"
                }
              >
                {person.status}
              </Badge>
            </div>
            <CardContent className="p-4 flex-1">
              <h3 className="text-lg font-semibold mb-2">{person.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{person.lastSeenLocation}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(person.dateLastSeen).toLocaleDateString()}</span>
              </div>
              {person.description && <p className="mt-2 text-sm line-clamp-2">{person.description}</p>}
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link href={`/missing-persons/${person.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <Button variant="outline" onClick={() => setPage((old) => Math.max(old - 1, 1))} disabled={page === 1}>
          Previous
        </Button>
        <Button variant="outline" onClick={() => setPage((old) => old + 1)} disabled={isPreviousData || !data.hasMore}>
          Next
        </Button>
      </div>
    </div>
  )
}

