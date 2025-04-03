"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin } from "lucide-react"

interface MissingPersonDetailsProps {
  person: any
}

export function MissingPersonDetails({ person }: MissingPersonDetailsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Basic details about the missing person</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="text-lg">{person.name}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Age</h3>
              <p className="text-lg">{person.age || "Not specified"}</p>
            </div>
          </div>
          <div>
            <div className="mb-4 flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Seen Location</h3>
                <p className="text-lg">{person.lastSeenLocation}</p>
              </div>
            </div>
            <div className="mb-4 flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date Last Seen</h3>
                <p className="text-lg">{new Date(person.dateLastSeen).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <CardDescription>Physical description and other details</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{person.description || "No description provided."}</p>
        </CardContent>
      </Card>

      {person.photo && (
        <Card>
          <CardHeader>
            <CardTitle>Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md">
              <img src={person.photo || "/placeholder.svg"} alt={person.name} className="w-full object-cover" />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="capitalize">{person.status}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Additional Details</h3>
              <p className="whitespace-pre-line">{person.additionalDetails || "No additional details provided."}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

