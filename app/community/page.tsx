"use client"

import { useEffect, useState } from "react"
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
import { createClient } from "@/lib/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Author {
  name: string
  avatar: string
  title: string
  company: string
}

interface Post {
  id: string
  author: Author
  content: string
  image: string | null
  time: string
  likes: number
  comments: number
  shares: number
  tags: string[]
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("all")

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching posts:', error.message)
      } else {
        setPosts(data || [])
      }
    }

    fetchPosts()
  }, [])

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort()

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = selectedTag === "all" || post.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

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
                  <Input
                    type="search"
                    placeholder="Search discussions..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="px-4 py-2">
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      {allTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => setSelectedTag(tag)}
                      >
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
                {filteredPosts.map((post) => (
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
                            src={post.image}
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
                  {filteredPosts
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
                                src={post.image}
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
