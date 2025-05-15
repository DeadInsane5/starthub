import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ArrowUpRight } from "lucide-react"

export default function DiscoverPage() {
  // Mock data for startups
  const startups = [
    {
      id: 1,
      name: "TechInnovate",
      logo: "/placeholder.svg?height=80&width=80",
      description: "AI-powered analytics platform for business intelligence",
      category: "AI & Machine Learning",
      stage: "Seed",
      location: "San Francisco, CA",
      tags: ["AI", "Analytics", "SaaS"],
    },
    {
      id: 2,
      name: "GreenEnergy",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Sustainable energy solutions for residential buildings",
      category: "CleanTech",
      stage: "Series A",
      location: "Austin, TX",
      tags: ["Renewable", "Energy", "Sustainability"],
    },
    {
      id: 3,
      name: "HealthTrack",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Remote patient monitoring and healthcare analytics",
      category: "HealthTech",
      stage: "Series B",
      location: "Boston, MA",
      tags: ["Healthcare", "IoT", "Analytics"],
    },
    {
      id: 4,
      name: "FinanceFlow",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Automated financial planning and investment platform",
      category: "FinTech",
      stage: "Seed",
      location: "New York, NY",
      tags: ["Finance", "Automation", "Investing"],
    },
    {
      id: 5,
      name: "EduLearn",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Personalized learning platform for K-12 students",
      category: "EdTech",
      stage: "Series A",
      location: "Chicago, IL",
      tags: ["Education", "AI", "Learning"],
    },
    {
      id: 6,
      name: "LogisticsPlus",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Supply chain optimization using blockchain technology",
      category: "Logistics",
      stage: "Seed",
      location: "Seattle, WA",
      tags: ["Blockchain", "Supply Chain", "Logistics"],
    },
    {
      id: 7,
      name: "RetailAI",
      logo: "/placeholder.svg?height=80&width=80",
      description: "AI-powered inventory management for retail businesses",
      category: "Retail",
      stage: "Series A",
      location: "Los Angeles, CA",
      tags: ["Retail", "AI", "Inventory"],
    },
    {
      id: 8,
      name: "SecureCloud",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Zero-trust security solutions for enterprise cloud",
      category: "Cybersecurity",
      stage: "Series B",
      location: "Denver, CO",
      tags: ["Security", "Cloud", "Enterprise"],
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Discover Startups</h1>
          <p className="text-muted-foreground">
            Find innovative startups and businesses to collaborate with or invest in.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search startups..." className="pl-8" />
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ai">AI & Machine Learning</SelectItem>
                <SelectItem value="cleantech">CleanTech</SelectItem>
                <SelectItem value="healthtech">HealthTech</SelectItem>
                <SelectItem value="fintech">FinTech</SelectItem>
                <SelectItem value="edtech">EdTech</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="idea">Idea</SelectItem>
                <SelectItem value="mvp">MVP</SelectItem>
                <SelectItem value="seed">Seed</SelectItem>
                <SelectItem value="seriesa">Series A</SelectItem>
                <SelectItem value="seriesb">Series B+</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>

        {/* Startups Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {startups.map((startup) => (
            <Card key={startup.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="bg-muted/50 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        src={startup.logo || "/placeholder.svg"}
                        alt={startup.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{startup.name}</CardTitle>
                      <CardDescription>{startup.category}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="line-clamp-3 text-sm">{startup.description}</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <Badge variant="outline">{startup.stage}</Badge>
                    <span className="text-muted-foreground">{startup.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {startup.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
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
