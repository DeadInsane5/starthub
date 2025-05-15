import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, Users, Search, Filter, ArrowUpRight, CalendarDays } from "lucide-react"

export default function EventsPage() {
  // Mock data for events
  const events = [
    {
      id: 1,
      title: "Startup Pitch Night",
      image: "/placeholder.svg?height=200&width=400",
      description: "Join us for an evening of innovative startup pitches and networking opportunities.",
      date: "May 25, 2025",
      time: "7:00 PM - 9:00 PM",
      location: "San Francisco, CA",
      type: "In-Person",
      category: "Networking",
      attendees: 120,
      organizer: "StartHub",
    },
    {
      id: 2,
      title: "Fundraising Workshop",
      image: "/placeholder.svg?height=200&width=400",
      description: "Learn effective strategies for raising capital from experienced investors and founders.",
      date: "May 28, 2025",
      time: "1:00 PM - 3:00 PM",
      location: "Virtual",
      type: "Online",
      category: "Workshop",
      attendees: 250,
      organizer: "Venture Capital Partners",
    },
    {
      id: 3,
      title: "Product Development Masterclass",
      image: "/placeholder.svg?height=200&width=400",
      description: "A comprehensive masterclass on building products that customers love.",
      date: "June 5, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "New York, NY",
      type: "In-Person",
      category: "Masterclass",
      attendees: 75,
      organizer: "Product School",
    },
    {
      id: 4,
      title: "AI in Startups Conference",
      image: "/placeholder.svg?height=200&width=400",
      description: "Explore how artificial intelligence is transforming the startup ecosystem.",
      date: "June 10-12, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Austin, TX",
      type: "In-Person",
      category: "Conference",
      attendees: 500,
      organizer: "TechInnovate",
    },
    {
      id: 5,
      title: "Founder Fireside Chat",
      image: "/placeholder.svg?height=200&width=400",
      description: "An intimate conversation with successful founders about their entrepreneurial journey.",
      date: "June 15, 2025",
      time: "6:00 PM - 8:00 PM",
      location: "Virtual",
      type: "Online",
      category: "Fireside Chat",
      attendees: 300,
      organizer: "StartHub",
    },
    {
      id: 6,
      title: "Growth Marketing Summit",
      image: "/placeholder.svg?height=200&width=400",
      description: "Discover cutting-edge marketing strategies to accelerate your startup's growth.",
      date: "June 20, 2025",
      time: "9:00 AM - 6:00 PM",
      location: "Chicago, IL",
      type: "In-Person",
      category: "Summit",
      attendees: 350,
      organizer: "Growth Hackers",
    },
    {
      id: 7,
      title: "Investor Office Hours",
      image: "/placeholder.svg?height=200&width=400",
      description: "One-on-one meetings with investors to discuss your startup and get feedback.",
      date: "June 25, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Virtual",
      type: "Online",
      category: "Mentorship",
      attendees: 50,
      organizer: "Tech Angels Network",
    },
    {
      id: 8,
      title: "Startup Legal Workshop",
      image: "/placeholder.svg?height=200&width=400",
      description: "Essential legal knowledge for founders, covering incorporation, IP, and contracts.",
      date: "July 2, 2025",
      time: "1:00 PM - 4:00 PM",
      location: "Boston, MA",
      type: "In-Person",
      category: "Workshop",
      attendees: 80,
      organizer: "Startup Lawyers",
    },
  ]

  // Get upcoming events (events with dates in the future)
  const upcomingEvents = events.slice(0, 4) // For demo purposes, just take the first 4

  // Get featured events (could be based on various criteria)
  const featuredEvents = events.filter((_, index) => index % 3 === 0) // For demo purposes, every 3rd event

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Discover and join events to connect with the startup community and learn from experts.
          </p>
        </div>

        {/* Featured Event */}
        <div className="relative overflow-hidden rounded-lg border">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative aspect-video md:aspect-auto">
              <Image
                src="/placeholder.svg?height=400&width=600&text=Featured+Event"
                alt="Featured Event"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-6">
              <Badge className="w-fit mb-2">{events[0].type}</Badge>
              <h2 className="text-2xl font-bold mb-2">{events[0].title}</h2>
              <p className="text-muted-foreground mb-4">{events[0].description}</p>
              <div className="grid gap-2 mb-6">
                <div className="flex items-center text-sm">
                  <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{events[0].date}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{events[0].time}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{events[0].location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{events[0].attendees} attendees</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <Button className="w-full sm:w-auto">Register Now</Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search events..." className="pl-8" />
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="summit">Summit</SelectItem>
                <SelectItem value="masterclass">Masterclass</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>

          {/* All Events Tab */}
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                    <div className="absolute right-2 top-2">
                      <Badge
                        className={
                          event.type === "Online"
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "bg-secondary hover:bg-secondary/80"
                        }
                      >
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1 text-lg">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <div className="flex items-center text-sm">
                      <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{event.attendees} attendees</span>
                      </div>
                      <Badge variant="outline">{event.category}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="flex w-full items-center justify-between">
                      <div className="text-xs text-muted-foreground">By {event.organizer}</div>
                      <Button size="sm" className="gap-1">
                        Details
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Upcoming Events Tab */}
          <TabsContent value="upcoming" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                    <div className="absolute right-2 top-2">
                      <Badge
                        className={
                          event.type === "Online"
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "bg-secondary hover:bg-secondary/80"
                        }
                      >
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1 text-lg">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <div className="flex items-center text-sm">
                      <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{event.attendees} attendees</span>
                      </div>
                      <Badge variant="outline">{event.category}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="flex w-full items-center justify-between">
                      <div className="text-xs text-muted-foreground">By {event.organizer}</div>
                      <Button size="sm" className="gap-1">
                        Details
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Featured Events Tab */}
          <TabsContent value="featured" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                    <div className="absolute right-2 top-2">
                      <Badge
                        className={
                          event.type === "Online"
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "bg-secondary hover:bg-secondary/80"
                        }
                      >
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1 text-lg">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <div className="flex items-center text-sm">
                      <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{event.attendees} attendees</span>
                      </div>
                      <Badge variant="outline">{event.category}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <div className="flex w-full items-center justify-between">
                      <div className="text-xs text-muted-foreground">By {event.organizer}</div>
                      <Button size="sm" className="gap-1">
                        Details
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Calendar Section */}
        <div className="mt-8">
          <div className="flex flex-col space-y-2 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Upcoming Events Calendar</h2>
            <p className="text-muted-foreground">View all upcoming events in calendar format to plan your schedule.</p>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>May 2025</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center">
                <div className="text-sm font-medium text-muted-foreground">Sun</div>
                <div className="text-sm font-medium text-muted-foreground">Mon</div>
                <div className="text-sm font-medium text-muted-foreground">Tue</div>
                <div className="text-sm font-medium text-muted-foreground">Wed</div>
                <div className="text-sm font-medium text-muted-foreground">Thu</div>
                <div className="text-sm font-medium text-muted-foreground">Fri</div>
                <div className="text-sm font-medium text-muted-foreground">Sat</div>
                {/* Calendar days - first row */}
                <div className="p-2 text-muted-foreground text-sm">27</div>
                <div className="p-2 text-muted-foreground text-sm">28</div>
                <div className="p-2 text-muted-foreground text-sm">29</div>
                <div className="p-2 text-muted-foreground text-sm">30</div>
                <div className="p-2 text-sm">1</div>
                <div className="p-2 text-sm">2</div>
                <div className="p-2 text-sm">3</div>
                {/* Calendar days - second row */}
                <div className="p-2 text-sm">4</div>
                <div className="p-2 text-sm">5</div>
                <div className="p-2 text-sm">6</div>
                <div className="p-2 text-sm">7</div>
                <div className="p-2 text-sm">8</div>
                <div className="p-2 text-sm">9</div>
                <div className="p-2 text-sm">10</div>
                {/* Calendar days - third row */}
                <div className="p-2 text-sm">11</div>
                <div className="p-2 text-sm">12</div>
                <div className="p-2 text-sm">13</div>
                <div className="p-2 text-sm">14</div>
                <div className="p-2 text-sm">15</div>
                <div className="p-2 text-sm">16</div>
                <div className="p-2 text-sm">17</div>
                {/* Calendar days - fourth row */}
                <div className="p-2 text-sm">18</div>
                <div className="p-2 text-sm">19</div>
                <div className="p-2 text-sm">20</div>
                <div className="p-2 text-sm">21</div>
                <div className="p-2 text-sm">22</div>
                <div className="p-2 text-sm">23</div>
                <div className="p-2 text-sm">24</div>
                {/* Calendar days - fifth row */}
                <div className="p-2 text-sm">25</div>
                <div className="p-2 text-sm relative">
                  26
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                </div>
                <div className="p-2 text-sm">27</div>
                <div className="p-2 text-sm relative">
                  28
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                </div>
                <div className="p-2 text-sm">29</div>
                <div className="p-2 text-sm">30</div>
                <div className="p-2 text-sm">31</div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">Events</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Host an Event Section */}
        <div className="mt-8">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Host Your Own Event</CardTitle>
              <CardDescription>
                Share your knowledge and connect with the community by hosting an event on StartHub.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Why host on StartHub?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs text-primary">✓</span>
                      </div>
                      <span>Reach a targeted audience of startup founders, investors, and professionals</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs text-primary">✓</span>
                      </div>
                      <span>Promote your event through our platform and newsletter</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs text-primary">✓</span>
                      </div>
                      <span>Access tools for registration, attendee management, and follow-up</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs text-primary">✓</span>
                      </div>
                      <span>Build your reputation and establish thought leadership</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <p className="text-muted-foreground">
                    Whether you're planning a workshop, networking event, or conference, we provide the tools and
                    audience to make it successful.
                  </p>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                    <Button className="w-full sm:w-auto">Host an Event</Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
