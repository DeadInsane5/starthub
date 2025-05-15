import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, ArrowUpRight } from "lucide-react"

export default function InvestorsPage() {
  // Mock data for investors
  const investors = [
    {
      id: 1,
      name: "Venture Capital Partners",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Early-stage venture capital firm focused on technology startups",
      type: "VC Firm",
      investmentRange: "$500K - $5M",
      location: "San Francisco, CA",
      interests: ["AI", "SaaS", "FinTech"],
      partners: [
        { name: "Sarah Johnson", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Michael Chen", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
    {
      id: 2,
      name: "Growth Equity Fund",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Growth-stage investment firm specializing in scaling businesses",
      type: "Private Equity",
      investmentRange: "$5M - $20M",
      location: "New York, NY",
      interests: ["HealthTech", "EdTech", "Enterprise"],
      partners: [
        { name: "David Wilson", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Emily Rodriguez", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
    {
      id: 3,
      name: "Tech Angels Network",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Angel investor network focused on early-stage tech startups",
      type: "Angel Network",
      investmentRange: "$50K - $500K",
      location: "Austin, TX",
      interests: ["Consumer Apps", "Marketplaces", "Web3"],
      partners: [
        { name: "Robert Kim", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Jessica Lee", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
    {
      id: 4,
      name: "Impact Ventures",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Investing in startups with positive social and environmental impact",
      type: "Impact Fund",
      investmentRange: "$250K - $2M",
      location: "Boston, MA",
      interests: ["CleanTech", "Sustainability", "HealthTech"],
      partners: [
        { name: "Thomas Green", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Sophia Martinez", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
    {
      id: 5,
      name: "Seed Capital Group",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Seed-stage investment firm for innovative technology startups",
      type: "Seed Fund",
      investmentRange: "$100K - $1M",
      location: "Seattle, WA",
      interests: ["AI", "Developer Tools", "Cybersecurity"],
      partners: [
        { name: "Alex Thompson", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Olivia Wang", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
    {
      id: 6,
      name: "Global Ventures",
      logo: "/placeholder.svg?height=80&width=80",
      description: "International investment firm with a focus on global expansion",
      type: "VC Firm",
      investmentRange: "$1M - $10M",
      location: "London, UK",
      interests: ["FinTech", "E-commerce", "Logistics"],
      partners: [
        { name: "James Wilson", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Amelia Patel", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
    {
      id: 7,
      name: "Future Fund",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Investing in frontier technologies shaping the future",
      type: "VC Firm",
      investmentRange: "$500K - $5M",
      location: "Los Angeles, CA",
      interests: ["Robotics", "Space Tech", "Biotech"],
      partners: [
        { name: "Daniel Park", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Natalie Brown", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
    {
      id: 8,
      name: "Strategic Investors",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Corporate venture capital providing strategic investments",
      type: "Corporate VC",
      investmentRange: "$2M - $15M",
      location: "Chicago, IL",
      interests: ["Enterprise", "B2B SaaS", "Industry 4.0"],
      partners: [
        { name: "Christopher Lee", avatar: "/placeholder.svg?height=40&width=40" },
        { name: "Rachel Garcia", avatar: "/placeholder.svg?height=40&width=40" },
      ],
    },
  ]

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
            <Input type="search" placeholder="Search investors..." className="pl-8" />
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="vc">VC Firm</SelectItem>
                <SelectItem value="angel">Angel Network</SelectItem>
                <SelectItem value="pe">Private Equity</SelectItem>
                <SelectItem value="corporate">Corporate VC</SelectItem>
                <SelectItem value="impact">Impact Fund</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Investment Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                <SelectItem value="seed">$50K - $500K</SelectItem>
                <SelectItem value="early">$500K - $5M</SelectItem>
                <SelectItem value="growth">$5M - $20M</SelectItem>
                <SelectItem value="late">$20M+</SelectItem>
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
          {investors.map((investor) => (
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
                              .map((n) => n[0])
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
