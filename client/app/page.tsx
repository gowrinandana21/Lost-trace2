import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MissingPersonsSearch } from "@/components/missing-persons-search"
import { MissingPersonsList } from "@/components/missing-persons-list"

export const metadata: Metadata = {
  title: "Missing Persons Database",
  description: "Search and view missing persons cases",
}

export default function HomePage() {
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
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Missing Persons Database</h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Search for missing persons and help bring them home
              </p>
            </div>
            <MissingPersonsSearch />
            <MissingPersonsList />
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

