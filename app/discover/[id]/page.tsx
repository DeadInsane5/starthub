"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Globe, Twitter, Linkedin, Github, Mail, Share2, Bookmark } from "lucide-react"
import { createClient } from '@/lib/supabase/client'

interface Startup {
  id: string
  name: string
  logo: string
  description: string
  longDescription: string
  category: string
  stage: string
  foundedYear: number
  location: string
  employeeCount: string
  fundingTotal: string
  website: string
  social: { twitter?: string; linkedin?: string; github?: string }
  tags: string[]
  team: { name: string; role: string; avatar: string; bio: string }[]
  metrics: { customers: number; arpu: string; retention: string; growth: string }
  investors: { name: string; logo: string }[]
}

export default function StartupProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params) // Unwrap params using React.use()
  const [startup, setStartup] = useState<Startup | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStartup = async () => {
      const supabase = createClient()
      try {
        // Fetch startup data
        const { data: startupData, error: startupError } = await supabase
          .from('startups')
          .select(`
            id,
            name,
            logo,
            description,
            longDescription,
            category,
            stage,
            foundedYear,
            location,
            employeeCount,
            fundingTotal,
            website,
            social,
            tags,
            team,
            metrics
          `)
          .eq('id', id)
          .single()

        if (startupError) {
          throw new Error(`Error fetching startup: ${startupError.message}`)
        }

        if (!startupData) {
          throw new Error('Startup not found')
        }

        // Fetch related investors
        const { data: investorData, error: investorError } = await supabase
          .from('startup_investors')
          .select(`
            investors (
              name,
              logo
            )
          `)
          .eq('startup_id', id)

        if (investorError) {
          throw new Error(`Error fetching investors: ${investorError.message}`)
        }

        // Map investor data to match the expected structure
        const investors = investorData?.map((item: any) => ({
          name: item.investors.name,
          logo: item.investors.logo,
        })) || []

        // Combine startup data with investors
        setStartup({
          ...startupData,
          investors,
        })
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchStartup()
  }, [id])

  if (loading) {
    return <div className="container py-10">Loading...</div>
  }

  if (error || !startup) {
    return <div className="container py-10">Error: {error || 'Startup not found'}</div>
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/discover" className="flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Discover
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6 flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-md sm:h-20 sm:w-20">
                <Image src={startup.logo || "/placeholder.svg"} alt={startup.name} fill className="object-cover" />
              </div>
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{startup.name}</h1>
                <p className="text-muted-foreground">{startup.category}</p>
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
              <Button size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="investors">Investors</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {startup.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="whitespace-pre-line">{startup.longDescription}</p>
                    <div className="flex flex-wrap gap-2">
                      {startup.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="team" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Leadership Team</CardTitle>
                  <CardDescription>Meet the people behind {startup.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {startup.team.map((member) => (
                      <div key={member.name} className="flex flex-col items-center space-y-2 text-center">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                        <p className="text-sm">{member.bio}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="metrics" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                  <CardDescription>Performance indicators for {startup.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Customers</p>
                      <p className="text-2xl font-bold">{startup.metrics.customers}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">ARPU</p>
                      <p className="text-2xl font-bold">{startup.metrics.arpu}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Retention</p>
                      <p className="text-2xl font-bold">{startup.metrics.retention}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Growth</p>
                      <p className="text-2xl font-bold">{startup.metrics.growth}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="investors" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Investors</CardTitle>
                  <CardDescription>Organizations backing {startup.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {startup.investors.map((investor) => (
                      <div key={investor.name} className="flex items-center space-x-4">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                          <Image
                            src={investor.logo || "/placeholder.svg"}
                            alt={investor.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{investor.name}</h3>
                          <Link href="#" className="text-sm text-primary hover:underline">
                            View Profile
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Founded</p>
                  <p>{startup.foundedYear}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stage</p>
                  <p>{startup.stage}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{startup.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employees</p>
                  <p>{startup.employeeCount}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Total Funding</p>
                <p className="text-xl font-bold">{startup.fundingTotal}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Connect</p>
                <div className="flex space-x-2">
                  <Link href={`https://${startup.website}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <Globe className="h-4 w-4" />
                      <span className="sr-only">Website</span>
                    </Button>
                  </Link>
                  {startup.social.twitter && (
                    <Link
                      href={`https://twitter.com/${startup.social.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon">
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Twitter</span>
                      </Button>
                    </Link>
                  )}
                  {startup.social.linkedin && (
                    <Link
                      href={`https://linkedin.com/company/${startup.social.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon">
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">LinkedIn</span>
                      </Button>
                    </Link>
                  )}
                  {startup.social.github && (
                    <Link
                      href={`https://github.com/${startup.social.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon">
                        <Github className="h-4 w-4" />
                        <span className="sr-only">GitHub</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
