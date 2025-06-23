"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, ArrowUpRight, Plus, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Investor {
  id: string;
  name: string;
  avatar: string;
  logo: string;
  description: string;
  type: string;
  investmentRange: string;
  location: string;
  interests: string[];
  partners: { name: string; avatar: string }[];
  created_at?: string;
  updated_at?: string;
}

interface Partner {
  name: string;
}

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState("all")
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [newInvestor, setNewInvestor] = useState({
    name: "",
    description: "",
    type: "",
    investmentRange: "",
    location: "",
    interests: ""
  })
  const [partners, setPartners] = useState<Partner[]>([{ name: "" }])

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

  const handleAddPartner = () => {
    setPartners([...partners, { name: "" }])
  }

  const handleRemovePartner = (index: number) => {
    setPartners(partners.filter((_, i) => i !== index))
  }

  const handlePartnerChange = (index: number, value: string) => {
    const updatedPartners = [...partners]
    updatedPartners[index] = { name: value }
    setPartners(updatedPartners)
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    const interestsArray = newInvestor.interests.split(',').map(interest => interest.trim()).filter(interest => interest !== '')

    const partnersData = partners
      .filter(partner => partner.name)
      .map(partner => ({
        name: partner.name,
        avatar: '/placeholder.svg?height=40&width=40'
      }))

    const { data, error } = await supabase
      .from('investors')
      .insert([{
        name: newInvestor.name,
        logo: '/placeholder.svg?height=80&width=80',
        description: newInvestor.description,
        type: newInvestor.type,
        investmentRange: newInvestor.investmentRange,
        location: newInvestor.location,
        interests: interestsArray,
        partners: partnersData.length > 0 ? partnersData : null
      }])
      .select()

    if (error) {
      console.error('Error registering investor:', error.message)
    } else {
      setInvestors([data[0], ...investors])
      setIsRegisterOpen(false)
      setNewInvestor({
        name: "",
        description: "",
        type: "",
        investmentRange: "",
        location: "",
        interests: ""
      })
      setPartners([{ name: "" }])
    }
  }

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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Investors</h1>
            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Register New Investor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Register New Investor</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newInvestor.name}
                        onChange={(e) => setNewInvestor({ ...newInvestor, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newInvestor.description}
                        onChange={(e) => setNewInvestor({ ...newInvestor, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={newInvestor.type}
                          onValueChange={(value) => setNewInvestor({ ...newInvestor, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VC Firm">VC Firm</SelectItem>
                            <SelectItem value="Angel Network">Angel Network</SelectItem>
                            <SelectItem value="Private Equity">Private Equity</SelectItem>
                            <SelectItem value="Corporate VC">Corporate VC</SelectItem>
                            <SelectItem value="Impact Fund">Impact Fund</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="investmentRange">Investment Range</Label>
                        <Select
                          value={newInvestor.investmentRange}
                          onValueChange={(value) => setNewInvestor({ ...newInvestor, investmentRange: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="$50K - $500K">$50K - $500K</SelectItem>
                            <SelectItem value="$500K - $5M">$500K - $5M</SelectItem>
                            <SelectItem value="$5M - $20M">$5M - $20M</SelectItem>
                            <SelectItem value="$20M+">$20M+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newInvestor.location}
                        onChange={(e) => setNewInvestor({ ...newInvestor, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="interests">Interests (comma-separated)</Label>
                      <Input
                        id="interests"
                        value={newInvestor.interests}
                        onChange={(e) => setNewInvestor({ ...newInvestor, interests: e.target.value })}
                        placeholder="e.g., AI, SaaS, FinTech"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Partners</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddPartner}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Partner
                        </Button>
                      </div>
                      {partners.map((partner, index) => (
                        <div key={index} className="border p-4 rounded-md space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium">Partner {index + 1}</h4>
                            {partners.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePartner(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div>
                            <Label htmlFor={`partner-name-${index}`}>Name</Label>
                            <Input
                              id={`partner-name-${index}`}
                              value={partner.name}
                              onChange={(e) => handlePartnerChange(index, e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => {
                      setIsRegisterOpen(false)
                      setPartners([{ name: "" }])
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
                  <Link href={`/investors/${investor.id}`}>
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
