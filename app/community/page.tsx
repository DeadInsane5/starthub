"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MessageSquare,
  Heart,
  Share,
  MoreHorizontal,
  Send,
  ThumbsUp,
  Filter,
  Bookmark,
  Flag,
  Search,
  Users,
} from "lucide-react"

export default function CommunityPage() {
  const [newPost, setNewPost] = useState("")
  const [isPosting, setIsPosting] = useState(false)

  // Mock data for posts
  const posts = [
    {
      id: 1,
      author: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "Startup Founder",
        company: "TechInnovate",
      },
      content:
        "Just closed our seed round of $1.5M! Looking for talented engineers to join our team. We're building an AI-powered analytics platform for business intelligence. DM me if interested!",
      image: "/placeholder.svg?height=300&width=600",
      time: "2 hours ago",
      likes: 42,
      comments: 12,
      shares: 5,
      tags: ["Funding", "Hiring", "AI"],
    },
    {
      id: 2,
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "VC Partner",
        company: "Venture Capital Partners",
      },
      content:
        "We're hosting a pitch event next month for early-stage startups in the HealthTech space. If you're working on innovative solutions in healthcare, apply through the link below!",
      time: "5 hours ago",
      likes: 28,
      comments: 8,
      shares: 15,
      tags: ["HealthTech", "Funding", "Event"],
    },
    {
      id: 3,
      author: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "Product Manager",
        company: "GreenEnergy",
      },
      content:
        "Just published our case study on how we reduced customer acquisition costs by 60% using content marketing. Check it out and let me know your thoughts!",
      image: "/placeholder.svg?height=300&width=600",
      time: "8 hours ago",
      likes: 35,
      comments: 6,
      shares: 10,
      tags: ["Marketing", "Growth", "CaseStudy"],
    },
    {
      id: 4,
      author: {
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "Startup Advisor",
        company: "StartupMentors",
      },
      content:
        "What's the biggest challenge you're facing with your startup right now? I'm hosting a free Q&A session this Friday to help founders overcome common obstacles.",
      time: "12 hours ago",
      likes: 19,
      comments: 24,
      shares: 3,
      tags: ["Advice", "Mentorship", "Q&A"],
    },
    {
      id: 5,
      author: {
        name: "David Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        title: "Angel Investor",
        company: "Tech Angels Network",
      },
      content:
        "Looking to invest in pre-seed B2B SaaS startups with a focus on productivity tools. If that's you, send me your pitch deck!",
      time: "1 day ago",
      likes: 56,
      comments: 18,
      shares: 12,
      tags: ["Investing", "B2B", "SaaS"],
    },
  ]

  // Handle post submission
  const handlePostSubmit = () => {
    if (!newPost.trim()) return

    setIsPosting(true)
    // This would normally be a server action or API call
    setTimeout(() => {
      setNewPost("")
      setIsPosting(false)
    }, 1000)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">
            Connect with founders, investors, and experts in the startup ecosystem.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Discover</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative px-4 py-2">
                  <Search className="absolute left-6 top-4 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search discussions..." className="pl-8" />
                </div>
                <nav className="flex flex-col space-y-1 p-2">
                  <Button variant="ghost" className="justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    All Discussions
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Popular Topics
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Saved Posts
                  </Button>
                </nav>
                <div className="px-4 py-2">
                  <h3 className="mb-2 text-sm font-medium">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Funding", "Marketing", "Product", "Hiring", "Growth", "AI", "SaaS"].map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create Post</CardTitle>
                <CardDescription>Share updates, ask questions, or start a discussion</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What's on your mind?"
                  className="min-h-[100px] resize-none"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Add Image
                  </Button>
                  <Button variant="outline" size="sm">
                    Add Tags
                  </Button>
                </div>
                <Button onClick={handlePostSubmit} disabled={!newPost.trim() || isPosting}>
                  {isPosting ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span className="ml-2">Posting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span>Post</span>
                      <Send className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Tabs defaultValue="all">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Posts</TabsTrigger>
                  <TabsTrigger value="following">Following</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>

              <TabsContent value="all" className="mt-6 space-y-6">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between">
                        <div className="flex items-start space-x-3">
                          <Avatar>
                            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                            <AvatarFallback>
                              {post.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{post.author.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {post.author.title} at {post.author.company} • {post.time}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Bookmark className="mr-2 h-4 w-4" />
                              Save post
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Flag className="mr-2 h-4 w-4" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="mb-4">{post.content}</p>
                      {post.image && (
                        <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt="Post image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t p-4">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex space-x-4">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Share className="h-4 w-4" />
                            <span>{post.shares}</span>
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Discussion
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="following" className="mt-6">
                <div className="flex flex-col items-center justify-center space-y-4 py-12">
                  <div className="rounded-full bg-muted p-6">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium">Follow more people</h3>
                  <p className="text-center text-muted-foreground">
                    When you follow people, their posts will appear here.
                  </p>
                  <Button>Discover People</Button>
                </div>
              </TabsContent>
              <TabsContent value="trending" className="mt-6">
                <div className="space-y-6">
                  {posts
                    .sort((a, b) => b.likes - a.likes)
                    .slice(0, 3)
                    .map((post) => (
                      <Card key={post.id}>
                        <CardHeader className="p-4 pb-0">
                          <div className="flex justify-between">
                            <div className="flex items-start space-x-3">
                              <Avatar>
                                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                                <AvatarFallback>
                                  {post.author.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{post.author.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {post.author.title} at {post.author.company} • {post.time}
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More options</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Bookmark className="mr-2 h-4 w-4" />
                                  Save post
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Flag className="mr-2 h-4 w-4" />
                                  Report
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="mb-4">{post.content}</p>
                          {post.image && (
                            <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
                              <Image
                                src={post.image || "/placeholder.svg"}
                                alt="Post image"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="border-t p-4">
                          <div className="flex w-full items-center justify-between">
                            <div className="flex space-x-4">
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Heart className="h-4 w-4" />
                                <span>{post.likes}</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{post.comments}</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Share className="h-4 w-4" />
                                <span>{post.shares}</span>
                              </Button>
                            </div>
                            <Button variant="ghost" size="sm">
                              View Discussion
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
