"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, ArrowUpRight, Clock, BookOpen, Video, FileText, Plus, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Resource {
  id: string;
  title: string;
  image: string;
  description: string;
  type: string;
  category: string;
  read_time: string;
  author: string;
  date: string;
  content_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg?height=200&width=400")
  const { toast } = useToast()
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    type: "",
    category: "",
    read_time: "",
    author: "",
    date: "",
    content_url: ""
  })

  useEffect(() => {
    const fetchResources = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching resources:', error.message)
      } else {
        setResources(data || [])
      }
    }

    fetchResources()
  }, [])

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      })
      return
    }

    const file = event.target.files[0]
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    const maxSize = 1024 * 1024 // 1MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPG, PNG, or GIF files are allowed.",
        variant: "destructive",
      })
      return
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Image must be less than 1MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    const supabase = createClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `resources/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      toast({
        title: "Error uploading image",
        description: uploadError.message,
        variant: "destructive",
      })
      setIsUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from("logos")
      .getPublicUrl(filePath)

    setImageUrl(publicUrlData.publicUrl)
    setIsUploading(false)
    toast({
      title: "Image uploaded successfully",
    })
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    const { data, error } = await supabase
      .from('resources')
      .insert([{
        title: newResource.title,
        image: imageUrl,
        description: newResource.description,
        type: newResource.type,
        category: newResource.category,
        read_time: newResource.read_time,
        author: newResource.author,
        date: newResource.date,
        content_url: newResource.content_url || null
      }])
      .select()

    if (error) {
      console.error('Error creating resource:', error.message)
      toast({
        title: "Error creating resource",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setResources([data[0], ...resources])
      setIsCreateOpen(false)
      setNewResource({
        title: "",
        description: "",
        type: "",
        category: "",
        read_time: "",
        author: "",
        date: "",
        content_url: ""
      })
      setImageUrl("/placeholder.svg?height=200&width=400")
      toast({
        title: "Resource created successfully",
      })
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || resource.type === selectedType
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    return matchesSearch && matchesType && matchesCategory
  })

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "Guide":
        return <BookOpen className="h-4 w-4" />
      case "Video":
        return <Video className="h-4 w-4" />
      case "Template":
        return <FileText className="h-4 w-4" />
      case "Article":
        return <BookOpen className="h-4 w-4" />
      case "Document":
        return <FileText className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Resource</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateSubmit} className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={imageUrl} alt="Resource Thumbnail" />
                          <AvatarFallback>RT</AvatarFallback>
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
                            <span className="sr-only">Upload resource thumbnail</span>
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
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newResource.description}
                        onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={newResource.type}
                          onValueChange={(value) => setNewResource({ ...newResource, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Guide">Guide</SelectItem>
                            <SelectItem value="Video">Video</SelectItem>
                            <SelectItem value="Template">Template</SelectItem>
                            <SelectItem value="Article">Article</SelectItem>
                            <SelectItem value="Document">Document</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newResource.category}
                          onValueChange={(value) => setNewResource({ ...newResource, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Funding">Funding</SelectItem>
                            <SelectItem value="Product">Product</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Team">Team</SelectItem>
                            <SelectItem value="Growth">Growth</SelectItem>
                            <SelectItem value="Planning">Planning</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Customer Success">Customer Success</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="read_time">Read/Watch Time</Label>
                      <Input
                        id="read_time"
                        value={newResource.read_time}
                        onChange={(e) => setNewResource({ ...newResource, read_time: e.target.value })}
                        placeholder="e.g., 15 min read"
                      />
                    </div>
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={newResource.author}
                        onChange={(e) => setNewResource({ ...newResource, author: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newResource.date}
                        onChange={(e) => setNewResource({ ...newResource, date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="content_url">Content URL (optional)</Label>
                      <Input
                        id="content_url"
                        value={newResource.content_url}
                        onChange={(e) => setNewResource({ ...newResource, content_url: e.target.value })}
                        placeholder="e.g., https://example.com/resource"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateOpen(false)
                        setImageUrl("/placeholder.svg?height=200&width=400")
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
          <p className="text-muted-foreground">Access curated resources to help you build and grow your startup.</p>
        </div>

        {/* Tabs and Search */}
        <div className="space-y-4">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Guide">Guides</TabsTrigger>
                <TabsTrigger value="Video">Videos</TabsTrigger>
                <TabsTrigger value="Template">Templates</TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search resources..."
                    className="pl-8 w-[200px] md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Funding">Funding</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Team">Team</SelectItem>
                    <SelectItem value="Growth">Growth</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Customer Success">Customer Success</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </div>
            </div>

            {/* Resources Grid */}
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <Image
                        src={resource.image || "/placeholder.svg"}
                        alt={resource.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute right-2 top-2">
                        <Badge className="bg-background/80 backdrop-blur-sm">{resource.type}</Badge>
                      </div>
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="line-clamp-1 text-lg">{resource.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Badge variant="secondary">{resource.category}</Badge>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {resource.read_time}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t p-4">
                      <div className="flex w-full items-center justify-between">
                        <div className="text-xs text-muted-foreground">{resource.date}</div>
                        <Link href={`/resources/${resource.id}`}>
                          <Button size="sm" className="gap-1">
                            View
                            <ArrowUpRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="Guide" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredResources
                  .filter((resource) => resource.type === "Guide")
                  .map((resource) => (
                    <Card key={resource.id} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <Image
                          src={resource.image || "/placeholder.svg"}
                          alt={resource.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute right-2 top-2">
                          <Badge className="bg-background/80 backdrop-blur-sm">{resource.type}</Badge>
                        </div>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="line-clamp-1 text-lg">{resource.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{resource.category}</Badge>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {resource.read_time}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t p-4">
                        <div className="flex w-full items-center justify-between">
                          <div className="text-xs text-muted-foreground">{resource.date}</div>
                          <Link href={`/resources/${resource.id}`}>
                            <Button size="sm" className="gap-1">
                              View
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="Video" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredResources
                  .filter((resource) => resource.type === "Video")
                  .map((resource) => (
                    <Card key={resource.id} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <Image
                          src={resource.image || "/placeholder.svg"}
                          alt={resource.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute right-2 top-2">
                          <Badge className="bg-background/80 backdrop-blur-sm">{resource.type}</Badge>
                        </div>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="line-clamp-1 text-lg">{resource.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{resource.category}</Badge>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {resource.read_time}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t p-4">
                        <div className="flex w-full items-center justify-between">
                          <div className="text-xs text-muted-foreground">{resource.date}</div>
                          <Link href={`/resources/${resource.id}`}>
                            <Button size="sm" className="gap-1">
                              View
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="Template" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredResources
                  .filter((resource) => resource.type === "Template")
                  .map((resource) => (
                    <Card key={resource.id} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <Image
                          src={resource.image || "/placeholder.svg"}
                          alt={resource.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute right-2 top-2">
                          <Badge className="bg-background/80 backdrop-blur-sm">{resource.type}</Badge>
                        </div>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="line-clamp-1 text-lg">{resource.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{resource.category}</Badge>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {resource.read_time}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t p-4">
                        <div className="flex w-full items-center justify-between">
                          <div className="text-xs text-muted-foreground">{resource.date}</div>
                          <Link href={`/resources/${resource.id}`}>
                            <Button size="sm" className="gap-1">
                              View
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
