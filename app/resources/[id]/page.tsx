"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Bookmark, Share2, Clock, User, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Resource {
  id: string
  title: string
  image: string | null
  description: string
  type: string | null
  category: string | null
  read_time: string | null
  author: string | null
  date: string | null
  created_at: string
  updated_at: string | null
  content_url: string | null
}

export default function ResourceProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResource = async () => {
      const supabase = createClient()
      try {
        const { data: resourceData, error: resourceError } = await supabase
          .from('resources')
          .select(`
            id,
            title,
            image,
            description,
            type,
            category,
            read_time,
            author,
            date,
            created_at,
            updated_at,
            content_url
          `)
          .eq('id', id)
          .single()

        if (resourceError) {
          throw new Error(`Error fetching resource: ${resourceError.message}`)
        }

        if (!resourceData) {
          throw new Error('Resource not found')
        }

        setResource(resourceData)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchResource()
  }, [id])

  if (loading) {
    return <div className="container py-10">Loading...</div>
  }

  if (error || !resource) {
    return <div className="container py-10">Error: {error || 'Resource not found'}</div>
  }

  const renderContent = () => {
    switch (resource.type?.toLowerCase()) {
      case 'guide':
      case 'article':
        return (
          <div className="prose max-w-none">
            <h2>{resource.title}</h2>
            <p className="text-muted-foreground">{resource.description}</p>
            {/* Blog-style content */}
            <div className="mt-4 space-y-4">
              <p>{resource.description}</p>
              {/* Add more blog-like formatting here if additional content fields exist */}
            </div>
          </div>
        )
      case 'template':
      case 'document':
        return (
          <div className="space-y-4">
            <h2>{resource.title}</h2>
            {resource.content_url ? (
              <div>
                <p className="text-muted-foreground mb-2">Download or view the document:</p>
                <Button asChild>
                  <a href={resource.content_url} target="_blank" rel="noopener noreferrer">
                    View Document
                  </a>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Document not available.</p>
            )}
            <p>{resource.description}</p>
          </div>
        )
      case 'video':
        return (
          <div className="space-y-4">
            <h2>{resource.title}</h2>
            {resource.content_url ? (
              <div className="aspect-video">
                <iframe
                  src={resource.content_url}
                  title={resource.title}
                  className="w-full h-full rounded-md"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="text-muted-foreground">Video not available.</p>
            )}
            <p>{resource.description}</p>
          </div>
        )
      default:
        return <p className="whitespace-pre-line">{resource.description}</p>
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/resources" className="flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
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
                  src={resource.image || "/placeholder.svg"}
                  alt={resource.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{resource.title}</h1>
                <p className="text-muted-foreground">{resource.category}</p>
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
              <CardTitle>Resource Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {resource.image && resource.type?.toLowerCase() !== 'video' && (
                <div className="relative h-64 w-full overflow-hidden rounded-md">
                  <Image
                    src={resource.image}
                    alt={resource.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              <div className="space-y-4">{renderContent()}</div>
              <div className="flex flex-wrap gap-2">
                {resource.type && <Badge variant="secondary">{resource.type}</Badge>}
                {resource.category && <Badge variant="secondary">{resource.category}</Badge>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {resource.read_time && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{resource.read_time}</p>
                  </div>
                )}
                {resource.author && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{resource.author}</p>
                  </div>
                )}
                {resource.date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {new Date(resource.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm">
                  {new Date(resource.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {resource.updated_at && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="text-sm">
                      {new Date(resource.updated_at).toLocaleDateString('en-US', {
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

