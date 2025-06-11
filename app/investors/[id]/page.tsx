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
import { ArrowLeft, Globe, Mail, Share2, Bookmark } from "lucide-react"
import { createClient } from '@/lib/supabase/client'

interface Investor {
  id: string
  name: string
  logo: string
  description: string
  type: string
  investmentRange: string
  location: string
  interests: string[]
  partners: { name: string; avatar: string }[]
  startups: { id: string; name: string; logo: string }[] // Added id to startups
}

export default function InvestorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params) // Unwrap params using React.use()
  const [investor, setInvestor] = useState<Investor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvestor = async () => {
      const supabase = createClient()
      try {
        // Fetch investor data
        const { data: investorData, error: investorError } = await supabase
          .from('investors')
          .select(`
            id,
            name,
            logo,
            description,
            type,
            investmentRange,
            location,
            interests,
            partners
          `)
          .eq('id', id)
          .single()

        if (investorError) {
          throw new Error(`Error fetching investor: ${investorError.message}`)
        }

        if (!investorData) {
          throw new Error('Investor not found')
        }

        // Fetch related startups with their id
        const { data: startupData, error: startupError } = await supabase
          .from('startup_investors')
          .select(`
            startups (
              id,
              name,
              logo
            )
          `)
          .eq('investor_id', id)

        if (startupError) {
          throw new Error(`Error fetching startups: ${startupError.message}`)
        }

        // Map startup data to include id
        const startups = startupData?.map((item: any) => ({
          id: item.startups.id,
          name: item.startups.name,
          logo: item.startups.logo,
        })) || []

        // Combine investor data with startups
        setInvestor({
          ...investorData,
          startups,
        })
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchInvestor()
  }, [id])

  if (loading) {
    return <div className="container py-10">Loading...</div>
  }

  if (error || !investor) {
    return <div className="container py-10">Error: {error || 'Investor not found'}</div>
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/investors" className="flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Investors
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6 flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-md sm:h-20 sm:w-20">
                <Image src={investor.logo || "/placeholder.svg"} alt={investor.name} fill className="object-cover" />
              </div>
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{investor.name}</h1>
                <p className="text-muted-foreground">{investor.type}</p>
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
              <TabsTrigger value="partners">Partners</TabsTrigger>
              <TabsTrigger value="investments">Investments</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {investor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="whitespace-pre-line">{investor.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {investor.interests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="partners" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Partners</CardTitle>
                  <CardDescription>Meet the key partners of {investor.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {investor.partners.map((partner) => (
                      <div key={partner.name} className="flex flex-col items-center space-y-2 text-center">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={partner.avatar || "/placeholder.svg"} alt={partner.name} />
                          <AvatarFallback>
                            {partner.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{partner.name}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="investments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Investments</CardTitle>
                  <CardDescription>Startups backed by {investor.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {investor.startups.length > 0 ? (
                      investor.startups.map((startup) => (
                        <div key={startup.id} className="flex items-center space-x-4">
                          <div className="relative h-12 w-12 overflow-hidden rounded-md">
                            <Image
                              src={startup.logo || "/placeholder.svg"}
                              alt={startup.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{startup.name}</h3>
                            <Link href={`/discover/${startup.id}`} className="text-sm text-primary hover:underline">
                              View Profile
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No investments found</p>
                    )}
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
              <CardTitle>Investor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p>{investor.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{investor.location}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Investment Range</p>
                  <p className="text-xl font-bold">{investor.investmentRange}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Connect</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" disabled>
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Website</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
