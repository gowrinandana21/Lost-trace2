"use client"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MissingPersonsSearch } from "@/components/missing-persons-search"
import { ArrowLeft, Calendar, MapPin } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""

  const { data, isLoading } = useQuery({
    queryKey: ["searchMissingPersons", query],
    queryFn: async () => {
      if (!query) return { items: [] }
      const response = await api.get("/api/missing-persons/search", {
        params: { query },
      })
      return response.data
    },
    enabled: !!query,
  })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="hidden sm:inline-block">Missing Persons Database</span>
            <span className="sm:hidden">MPD</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-10">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl">Search Results</h1>
                <p className="text-muted-foreground">
                  {query ? `Showing results for "${query}"` : "Enter a search term"}
                </p>
              </div>
            </div>

            <MissingPersonsSearch />

            {isLoading ? (
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
            ) : !data || data.items.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  {query
                    ? "No missing persons match your search criteria."
                    : "Please enter a search term to find missing persons."}
                </p>
              </div>
            ) : (
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
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No photo available
                        </div>
                      )}
                      <Badge
                        className="absolute top-2 right-2"
                        variant={
                          person.status === "active"
                            ? "destructive"
                            : person.status === "found"
                              ? "success"
                              : "secondary"
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
            )}
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Missing Persons Database. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

