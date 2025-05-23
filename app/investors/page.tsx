"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, ArrowUpRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function InvestorsPage() {
  interface investor {
    id: number,
    name: string,
    avatar: string,
    logo: string,
    description: string,
    type: string,
    investmentRange: string,
    location: string,
    interests: string[],
    partners: { name: string, avatar: string }[]
  }

  const [investors, setInvestors] = useState<investor[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState("all")

  useEffect(() => {
    const fetchInvestors = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching investors:', error.message)
      } else {
        setInvestors(data || [])
      }
    }

    fetchInvestors()
  }, [])

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || investor.type === selectedType
    const matchesInvestmentRange = selectedInvestmentRange === "all" || investor.investmentRange === selectedInvestmentRange
    return matchesSearch && matchesType && matchesInvestmentRange
  })

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Investors</h1>
          <p className="text-muted-foreground">
            Connect with investors, venture capital firms, and angel networks looking for opportunities.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search investors..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="VC Firm">VC Firm</SelectItem>
                <SelectItem value="Angel Network">Angel Network</SelectItem>
                <SelectItem value="Private Equity">Private Equity</SelectItem>
                <SelectItem value="Corporate VC">Corporate VC</SelectItem>
                <SelectItem value="Impact Fund">Impact Fund</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedInvestmentRange} onValueChange={setSelectedInvestmentRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Investment Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                <SelectItem value="$50K - $500K">$50K - $500K</SelectItem>
                <SelectItem value="$500K - $5M">$500K - $5M</SelectItem>
                <SelectItem value="$5M - $20M">$5M - $20M</SelectItem>
                <SelectItem value="$20M+">$20M+</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>

        {/* Investors Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredInvestors.map((investor) => (
            <Card key={investor.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="bg-muted/50 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        src={investor.logo || "/placeholder.svg"}
                        alt={investor.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{investor.name}</CardTitle>
                      <CardDescription>{investor.type}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="line-clamp-3 text-sm">{investor.description}</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Badge variant="outline">{investor.investmentRange}</Badge>
                      <span className="text-muted-foreground">{investor.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {investor.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Key Partners</p>
                    <div className="flex -space-x-2">
                      {investor.partners.map((partner, index) => (
                        <Avatar key={index} className="border-2 border-background">
                          <AvatarImage src={partner.avatar || "/placeholder.svg"} alt={partner.name} />
                          <AvatarFallback>
                            {partner.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-6">
                <div className="flex w-full items-center justify-between">
                  <Button variant="ghost" size="sm">
                    Save
                  </Button>
                  <Button size="sm" className="gap-1">
                    View Profile
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="px-4 font-medium">
            1
          </Button>
          <Button variant="ghost" size="sm" className="px-4 font-medium">
            2
          </Button>
          <Button variant="ghost" size="sm" className="px-4 font-medium">
            3
          </Button>
          <Button variant="ghost" size="sm" className="px-4 font-medium">
            ...
          </Button>
          <Button variant="ghost" size="sm" className="px-4 font-medium">
            8
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
