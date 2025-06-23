import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Rocket, Briefcase, BookOpen, ArrowRight, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Connect, Collaborate, and Grow Your Startup
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  StartHub is the ultimate platform for startup founders, businesses, investors, and customers to
                  connect and expand their reach.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/sign-up">
                  <Button size="lg" className="px-8">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/discover">
                  <Button size="lg" variant="outline" className="px-8">
                    Explore Startups
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto">
              <Image
                src="/hero-image.jpg?height=550&width=550"
                width={550}
                height={550}
                alt="StartHub Platform"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need to Succeed
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                StartHub provides all the tools and connections you need to take your startup to the next level.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Discover Startups</h3>
              <p className="text-center text-muted-foreground">
                Find innovative startups and businesses to collaborate with or invest in.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Connect with Investors</h3>
              <p className="text-center text-muted-foreground">
                Meet potential investors who are looking for the next big opportunity.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Access Resources</h3>
              <p className="text-center text-muted-foreground">
                Learn from curated resources designed to help your startup grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mx-auto lg:order-last">
              <Image
                src="/community-image.jpg?height=400&width=500"
                width={500}
                height={400}
                alt="StartHub Community"
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Join Our Thriving Community</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Connect with like-minded entrepreneurs, share ideas, and get feedback from the StartHub community.
                </p>
              </div>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Engage in meaningful discussions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Participate in community events</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Get advice from experienced founders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Showcase your startup to potential customers</span>
                </li>
              </ul>
              <div>
                <Link href="/community">
                  <Button>
                    Explore Community
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Upcoming Events</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Join our virtual and in-person events to network and learn from industry experts.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-lg border shadow-sm">
                <div className="relative aspect-video">
                  <Image
                    src={`/coming-soon-events.jpg?height=200&width=400&text=Event+${i}`}
                    fill
                    alt={`Event ${i}`}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col space-y-2 p-4">
                  <h3 className="font-bold">Startup Pitch Night</h3>
                  <p className="text-xs text-muted-foreground">May 25, 2025 • 7:00 PM</p>
                  <p className="text-sm text-muted-foreground">
                    Join us for an evening of innovative startup pitches and networking opportunities.
                  </p>
                  <Link href="/events" className="text-sm text-primary hover:underline mt-2">
                    Learn more
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/events">
              <Button variant="outline">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center rounded-lg border bg-card p-8 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Join StartHub?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Create your profile today and start connecting with startups, investors, and resources.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/sign-up">
                <Button size="lg" className="px-8">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/discover">
                <Button size="lg" variant="outline" className="px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">StartHub</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:underline">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Resources</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <Link href="/resources" className="hover:underline">
                    Learning Center
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:underline">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Legal</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <Link href="/terms" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:underline">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Connect</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:underline">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} StartHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
