"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, Users, Search, Filter, ArrowUpRight, CalendarDays, Plus, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  category: string;
  attendees: number;
  organizer: string;
  image: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg?height=200&width=400");
  const { toast } = useToast();
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "",
    category: "",
    attendees: 0,
    organizer: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching events:", error.message);
      } else {
        setEvents(data || []);
      }
    };

    fetchEvents();
  }, []);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    const file = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 1024 * 1024; // 1MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPG, PNG, or GIF files are allowed.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Image must be less than 1MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `events/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      toast({
        title: "Error uploading image",
        description: uploadError.message,
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("logos")
      .getPublicUrl(filePath);

    setImageUrl(publicUrlData.publicUrl);
    setIsUploading(false);
    toast({
      title: "Image uploaded successfully",
    });
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    // Format the date as a PostgreSQL DATERANGE literal
    const dateRange = `[${newEvent.date},${newEvent.date}]`;

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          title: newEvent.title,
          image: imageUrl,
          description: newEvent.description,
          date: dateRange,
          time: newEvent.time,
          location: newEvent.location,
          type: newEvent.type,
          category: newEvent.category,
          attendees: newEvent.attendees || 0,
          organizer: newEvent.organizer,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating event:", error.message);
      toast({
        title: "Error creating event",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEvents([data[0], ...events]);
      setIsRegisterOpen(false);
      setNewEvent({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        type: "",
        category: "",
        attendees: 0,
        organizer: "",
      });
      setImageUrl("/placeholder.svg?height=200&width=400");
      toast({
        title: "Event created successfully",
      });
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || event.type.toLowerCase() === selectedType.toLowerCase();
    const matchesCategory = selectedCategory === "all" || event.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesType && matchesCategory;
  });

  // Get upcoming events (events with dates in the future)
  const upcomingEvents = () =>
    filteredEvents
      .filter((event) => new Date(event.date) >= new Date("2025-06-23"))
      .slice(0, 4);

  // Get featured events (based on attendees, for example)
  const featuredEvents = filteredEvents.sort((a, b) => b.attendees - a.attendees).slice(0, 3);

  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Events</h1>
            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Register New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Register New Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateSubmit} className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={imageUrl} alt="Event Thumbnail" />
                          <AvatarFallback>ET</AvatarFallback>
                        </Avatar>
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                          asChild
                          disabled={isUploading}
                        >
                          <label htmlFor="image-upload">
                            <Upload className="h-4 w-4" />
                            <span className="sr-only">Upload event thumbnail</span>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/jpeg,image/png,image/gif"
                              className="hidden"
                              onChange={handleImageUpload}
                              disabled={isUploading}
                            />
                          </label>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">JPG, PNG, or GIF. 1MB max.</p>
                    </div>
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                          placeholder="e.g., 7:00 PM - 9:00 PM"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        placeholder="e.g., San Francisco, CA or Zoom URL"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={newEvent.type}
                          onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="In-Person">In-Person</SelectItem>
                            <SelectItem value="Online">Online</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newEvent.category}
                          onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Networking">Networking</SelectItem>
                            <SelectItem value="Workshop">Workshop</SelectItem>
                            <SelectItem value="Conference">Conference</SelectItem>
                            <SelectItem value="Summit">Summit</SelectItem>
                            <SelectItem value="Masterclass">Masterclass</SelectItem>
                            <SelectItem value="Fireside Chat">Fireside Chat</SelectItem>
                            <SelectItem value="Mentorship">Mentorship</SelectItem>
                            <SelectItem value="Demo Day">Demo Day</SelectItem>
                            <SelectItem value="Webinar">Webinar</SelectItem>
                            <SelectItem value="Bootcamp">Bootcamp</SelectItem>
                            <SelectItem value="Roundtable">Roundtable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="attendees">Expected Attendees</Label>
                      <Input
                        id="attendees"
                        type="number"
                        value={newEvent.attendees}
                        onChange={(e) => setNewEvent({ ...newEvent, attendees: parseInt(e.target.value) || 0 })}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="organizer">Organizer</Label>
                      <Input
                        id="organizer"
                        value={newEvent.organizer}
                        onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsRegisterOpen(false);
                        setImageUrl("/placeholder.svg?height=200&width=400");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUploading}>Create</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground">
            Discover and join events to connect with the startup community and learn from experts.
          </p>
        </div>

        {/* Featured Event */}
        {filteredEvents.length > 0 && (
          <div className="relative overflow-hidden rounded-lg border">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="relative aspect-video md:aspect-auto">
                <Image
                  src={filteredEvents[0].image || "/placeholder.svg?height=400&width=600&text=Featured+Event"}
                  alt="Featured Event"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-6">
                <Badge className="w-fit mb-2">{filteredEvents[0].type}</Badge>
                <h2 className="text-2xl font-bold mb-2">{filteredEvents[0].title}</h2>
                <p className="text-muted-foreground mb-4">{filteredEvents[0].description}</p>
                <div className="grid gap-2 mb-6">
                  <div className="flex items-center text-sm">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{filteredEvents[0].date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{filteredEvents[0].time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{filteredEvents[0].location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{filteredEvents[0].attendees} attendees</span>
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
        )}

        {/* Search and Filter */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="In-Person">In-Person</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Networking">Networking</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Conference">Conference</SelectItem>
                <SelectItem value="Summit">Summit</SelectItem>
                <SelectItem value="Masterclass">Masterclass</SelectItem>
                <SelectItem value="Fireside Chat">Fireside Chat</SelectItem>
                <SelectItem value="Mentorship">Mentorship</SelectItem>
                <SelectItem value="Demo Day">Demo Day</SelectItem>
                <SelectItem value="Webinar">Webinar</SelectItem>
                <SelectItem value="Bootcamp">Bootcamp</SelectItem>
                <SelectItem value="Roundtable">Roundtable</SelectItem>
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
              {filteredEvents.map((event) => (
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
                      <Link href={`/events/${event.id}`}>
                        <Button size="sm" className="gap-1">
                          Details
                          <ArrowUpRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Upcoming Events Tab */}
          <TabsContent value="upcoming" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {upcomingEvents().map((event) => (
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
                      <Link href={`/events/${event.id}`}>
                        <Button size="sm" className="gap-1">
                          Details
                          <ArrowUpRight className="h-3 w-3" />
                        </Button>
                      </Link>
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
                      <Link href={`/events/${event.id}`}>
                        <Button size="sm" className="gap-1">
                          Details
                          <ArrowUpRight className="h-3 w-3" />
                        </Button>
                      </Link>
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
                <CardTitle>June 2025</CardTitle>
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
                {/* Calendar days */}
                <div className="p-2 text-sm text-muted-foreground">1</div>
                <div className="p-2 text-sm text-muted-foreground">2</div>
                <div className="p-2 text-sm text-muted-foreground">3</div>
                <div className="p-2 text-sm text-muted-foreground">4</div>
                <div className="p-2 text-sm">5</div>
                <div className="p-2 text-sm">6</div>
                <div className="p-2 text-sm">7</div>
                <div className="p-2 text-sm">8</div>
                <div className="p-2 text-sm">9</div>
                <div className="p-2 text-sm">10</div>
                <div className="p-2 text-sm">11</div>
                <div className="p-2 text-sm">12</div>
                <div className="p-2 text-sm">13</div>
                <div className="p-2 text-sm">14</div>
                <div className="p-2 text-sm">15</div>
                <div className="p-2 text-sm">16</div>
                <div className="p-2 text-sm">17</div>
                <div className="p-2 text-sm">18</div>
                <div className="p-2 text-sm">19</div>
                <div className="p-2 text-sm">20</div>
                <div className="p-2 text-sm">21</div>
                <div className="p-2 text-sm">22</div>
                <div className="p-2 text-sm">23</div>
                <div className="p-2 text-sm">24</div>
                <div className="p-2 text-sm">25</div>
                <div className="p-2 text-sm relative">
                  26
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                </div>
                <div className="p-2 text-sm relative">
                  27
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                </div>
                <div className="p-2 text-sm">28</div>
                <div className="p-2 text-sm">29</div>
                <div className="p-2 text-sm">30</div>
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
  );
}
