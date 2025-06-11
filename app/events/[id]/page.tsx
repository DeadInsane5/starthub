"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Bookmark, Share2, Clock, User, Calendar, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Event {
  id: string
  title: string
  image: string | null
  description: string
  date: string // DATERANGE stored as string in Supabase
  time: string | null
  location: string | null
  type: string | null
  category: string | null
  attendees: number | null
  organizer: string | null
  created_at: string
  updated_at: string | null
}

export default function EventsProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      const supabase = createClient()
      try {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select(`
            id,
            title,
            image,
            description,
            date,
            time,
            location,
            type,
            category,
            attendees,
            organizer,
            created_at,
            updated_at
          `)
          .eq('id', id)
          .single()

        if (eventError) {
          throw new Error(`Error fetching event: ${eventError.message}`)
        }

        if (!eventData) {
          throw new Error('Event not found')
        }

        setEvent(eventData)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  if (loading) {
    return <div className="container py-10">Loading...</div>
  }

  if (error || !event) {
    return <div className="container py-10">Error: {error || 'Event not found'}</div>
  }

  // Parse DATERANGE to display readable format
  const parseDateRange = (dateRange: string) => {
    const match = dateRange.match(/\[(.*?),\s*(.*?)\)/)
    if (!match) return 'Date not available'
    const [_, startDate, endDate] = match
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
    
    return `${start.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })} - ${end.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/events" className="flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6 flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-md sm:h-20 sm:w-20">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{event.title}</h1>
                <p className="text-muted-foreground">{event.category}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {event.image && (
                <div className="relative h-64 w-full overflow-hidden rounded-md">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              <div className="space-y-4">
                <p className="whitespace-pre-line">{event.description}</p>
                <div className="flex flex-wrap gap-2">
                  {event.type && <Badge variant="secondary">{event.type}</Badge>
                  }
                  {event.category && <Badge variant="secondary">{event.category}</Badge>
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {event.date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{parseDateRange(event.date)}</p>
                  </div>
                )}
                {event.time && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{event.time}</p>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {event.type?.toLowerCase() === 'online' ? (
                        <a
                          href={event.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Virtual Event Link
                        </a>
                      ) : (
                        event.location
                      )}
                    </p>
                  </div>
                )}
                {event.attendees && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{event.attendees} Attendees</p>
                  </div>
                )}
                {event.organizer && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{event.organizer}</p>
                  </div>
                )}
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm">
                  {new Date(event.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {event.updated_at && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="text-sm">
                      {new Date(event.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
