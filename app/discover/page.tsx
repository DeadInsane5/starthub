"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ArrowUpRight, Plus, Trash2 } from "lucide-react"
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Startup {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: string;
  stage: string;
  location: string;
  tags: string[];
  longDescription?: string;
  foundedYear?: number;
  employeeCount?: string;
  fundingTotal?: string;
  website?: string;
  social?: { twitter?: string; linkedin?: string; github?: string };
  team?: { name: string; role: string; avatar: string; bio: string }[];
  metrics?: { customers?: number; arpu?: string; retention?: string; growth?: string };
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

export default function DiscoverPage() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStage, setSelectedStage] = useState("all")
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [newStartup, setNewStartup] = useState({
    name: "",
    description: "",
    category: "",
    stage: "",
    location: "",
    tags: "",
    longDescription: "",
    foundedYear: "",
    employeeCount: "",
    fundingTotal: "",
    website: "",
    twitter: "",
    linkedin: "",
    github: "",
    metricsCustomers: "",
    metricsArpu: "",
    metricsRetention: "",
    metricsGrowth: ""
  })
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ name: "", role: "", bio: "" }])

  useEffect(() => {
    const fetchStartups = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('error fetching startups', error)
      } else {
        setStartups(data || [])
      }
    }

    fetchStartups()
  }, [])

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", role: "", bio: "" }])
  }

  const handleRemoveTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index))
  }

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updatedTeam = [...teamMembers]
    updatedTeam[index] = { ...updatedTeam[index], [field]: value }
    setTeamMembers(updatedTeam)
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    
    const tagsArray = newStartup.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    
    const teamData = teamMembers
      .filter(member => member.name && member.role) // Only include members with name and role
      .map(member => ({
        name: member.name,
        role: member.role,
        avatar: '/placeholder.svg?height=80&width=80', // Use placeholder avatar
        bio: member.bio
      }))

    const metricsData = {
      customers: newStartup.metricsCustomers ? parseInt(newStartup.metricsCustomers) : undefined,
      arpu: newStartup.metricsArpu || undefined,
      retention: newStartup.metricsRetention || undefined,
      growth: newStartup.metricsGrowth || undefined
    }

    const { data, error } = await supabase
      .from('startups')
      .insert([{
        name: newStartup.name,
        logo: '/placeholder.svg?height=120&width=120',
        description: newStartup.description,
        category: newStartup.category,
        stage: newStartup.stage,
        location: newStartup.location,
        tags: tagsArray,
        longDescription: newStartup.longDescription,
        foundedYear: newStartup.foundedYear ? parseInt(newStartup.foundedYear) : null,
        employeeCount: newStartup.employeeCount,
        fundingTotal: newStartup.fundingTotal,
        website: newStartup.website,
        social: {
          twitter: newStartup.twitter || null,
          linkedin: newStartup.linkedin || null,
          github: newStartup.github || null
        },
        team: teamData.length > 0 ? teamData : null,
        metrics: Object.values(metricsData).some(val => val !== undefined) ? metricsData : null
      }])
      .select()

    if (error) {
      console.error('error registering startup', error)
    } else {
      setStartups([data[0], ...startups])
      setIsRegisterOpen(false)
      setNewStartup({
        name: "",
        description: "",
        category: "",
        stage: "",
        location: "",
        tags: "",
        longDescription: "",
        foundedYear: "",
        employeeCount: "",
        fundingTotal: "",
        website: "",
        twitter: "",
        linkedin: "",
        github: "",
        metricsCustomers: "",
        metricsArpu: "",
        metricsRetention: "",
        metricsGrowth: ""
      })
      setTeamMembers([{ name: "", role: "", bio: "" }])
    }
  }

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || startup.category === selectedCategory
    const matchesStage = selectedStage === "all" || startup.stage === selectedStage
    return matchesSearch && matchesCategory && matchesStage
  })

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Discover Startups</h1>
            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Register New Startup
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Register New Startup</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newStartup.name}
                        onChange={(e) => setNewStartup({ ...newStartup, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Short Description</Label>
                      <Input
                        id="description"
                        value={newStartup.description}
                        onChange={(e) => setNewStartup({ ...newStartup, description: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="longDescription">Detailed Description</Label>
                      <Textarea
                        id="longDescription"
                        value={newStartup.longDescription}
                        onChange={(e) => setNewStartup({ ...newStartup, longDescription: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newStartup.category}
                          onValueChange={(value) => setNewStartup({ ...newStartup, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                            <SelectItem value="CleanTech">CleanTech</SelectItem>
                            <SelectItem value="HealthTech">HealthTech</SelectItem>
                            <SelectItem value="FinTech">FinTech</SelectItem>
                            <SelectItem value="EdTech">EdTech</SelectItem>
                            <SelectItem value="Logistics">Logistics</SelectItem>
                            <SelectItem value="Retail">Retail</SelectItem>
                            <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="stage">Stage</Label>
                        <Select
                          value={newStartup.stage}
                          onValueChange={(value) => setNewStartup({ ...newStartup, stage: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Idea">Idea</SelectItem>
                            <SelectItem value="MVP">MVP</SelectItem>
                            <SelectItem value="Seed">Seed</SelectItem>
                            <SelectItem value="Series A">Series A</SelectItem>
                            <SelectItem value="Series B">Series B+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newStartup.location}
                        onChange={(e) => setNewStartup({ ...newStartup, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={newStartup.tags}
                        onChange={(e) => setNewStartup({ ...newStartup, tags: e.target.value })}
                        placeholder="e.g., AI, SaaS, Analytics"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="foundedYear">Founded Year</Label>
                        <Input
                          id="foundedYear"
                          type="number"
                          value={newStartup.foundedYear}
                          onChange={(e) => setNewStartup({ ...newStartup, foundedYear: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="employeeCount">Employee Count</Label>
                        <Input
                          id="employeeCount"
                          value={newStartup.employeeCount}
                          onChange={(e) => setNewStartup({ ...newStartup, employeeCount: e.target.value })}
                          placeholder="e.g., 11-50"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="fundingTotal">Total Funding</Label>
                      <Input
                        id="fundingTotal"
                        value={newStartup.fundingTotal}
                        onChange={(e) => setNewStartup({ ...newStartup, fundingTotal: e.target.value })}
                        placeholder="e.g., $1.5M"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={newStartup.website}
                        onChange={(e) => setNewStartup({ ...newStartup, website: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="twitter">Twitter Handle</Label>
                        <Input
                          id="twitter"
                          value={newStartup.twitter}
                          onChange={(e) => setNewStartup({ ...newStartup, twitter: e.target.value })}
                          placeholder="e.g., startupname"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={newStartup.linkedin}
                          onChange={(e) => setNewStartup({ ...newStartup, linkedin: e.target.value })}
                          placeholder="e.g., startupname"
                        />
                      </div>
                      <div>
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                          id="github"
                          value={newStartup.github}
                          onChange={(e) => setNewStartup({ ...newStartup, github: e.target.value })}
                          placeholder="e.g., startupname"
                        />
                      </div>
                    </div>

                    {/* Team Members Section */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Team Members</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddTeamMember}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Member
                        </Button>
                      </div>
                      {teamMembers.map((member, index) => (
                        <div key={index} className="border p-4 rounded-md space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium">Team Member {index + 1}</h4>
                            {teamMembers.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveTeamMember(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`team-name-${index}`}>Name</Label>
                              <Input
                                id={`team-name-${index}`}
                                value={member.name}
                                onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor={`team-role-${index}`}>Role</Label>
                              <Input
                                id={`team-role-${index}`}
                                value={member.role}
                                onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`team-bio-${index}`}>Bio</Label>
                            <Textarea
                              id={`team-bio-${index}`}
                              value={member.bio}
                              onChange={(e) => handleTeamMemberChange(index, 'bio', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Metrics Section */}
                    <div className="space-y-4">
                      <Label>Metrics</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="metricsCustomers">Customers</Label>
                          <Input
                            id="metricsCustomers"
                            type="number"
                            value={newStartup.metricsCustomers}
                            onChange={(e) => setNewStartup({ ...newStartup, metricsCustomers: e.target.value })}
                            placeholder="e.g., 100"
                          />
                        </div>
                        <div>
                          <Label htmlFor="metricsArpu">ARPU</Label>
                          <Input
                            id="metricsArpu"
                            value={newStartup.metricsArpu}
                            onChange={(e) => setNewStartup({ ...newStartup, metricsArpu: e.target.value })}
                            placeholder="e.g., $2,500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="metricsRetention">Retention</Label>
                          <Input
                            id="metricsRetention"
                            value={newStartup.metricsRetention}
                            onChange={(e) => setNewStartup({ ...newStartup, metricsRetention: e.target.value })}
                            placeholder="e.g., 90%"
                          />
                        </div>
                        <div>
                          <Label htmlFor="metricsGrowth">Growth (MoM)</Label>
                          <Input
                            id="metricsGrowth"
                            value={newStartup.metricsGrowth}
                            onChange={(e) => setNewStartup({ ...newStartup, metricsGrowth: e.target.value })}
                            placeholder="e.g., 15%"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => {
                      setIsRegisterOpen(false)
                      setTeamMembers([{ name: "", role: "", bio: "" }])
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit">Register</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground">
            Find innovative startups and businesses to collaborate with or invest in.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search startups..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                <SelectItem value="CleanTech">CleanTech</SelectItem>
                <SelectItem value="HealthTech">HealthTech</SelectItem>
                <SelectItem value="FinTech">FinTech</SelectItem>
                <SelectItem value="EdTech">EdTech</SelectItem>
                <SelectItem value="Logistics">Logistics</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="Idea">Idea</SelectItem>
                <SelectItem value="MVP">MVP</SelectItem>
                <SelectItem value="Seed">Seed</SelectItem>
                <SelectItem value="Series A">Series A</SelectItem>
                <SelectItem value="Series B">Series B+</SelectItem>
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
          {filteredStartups.map((startup: Startup) => (
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
                    {startup.tags.map((tag: string) => (
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
                  <Link href={`/discover/${startup.id}`}>
                    <Button size="sm" className="gap-1">
                      View Profile
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination (Static Placeholder) */}
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
