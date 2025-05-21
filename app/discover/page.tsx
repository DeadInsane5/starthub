import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ArrowUpRight } from "lucide-react"

import { createClient } from '@/lib/supabase/server'

export default async function DiscoverPage() {
  const supabase = await createClient();
  const { data: startups, error: fetchError } = await supabase.from('startups').select('*').order('created_at', { ascending: false });

  if (fetchError) {
    console.log('error fetching startups', fetchError);
  }

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
          {startups?.map((startup: any) => (
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
                    {startup.tags.map((tag: any) => (
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
