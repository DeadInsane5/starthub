"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Settings,
  Bell,
  Shield,
  Upload,
  Briefcase,
  MapPin,
  LinkIcon,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/app/auth-context";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  bio: z.string().max(500, {
    message: "Bio must not be longer than 500 characters.",
  }).optional(),
  location: z.string().optional(),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
});

const accountFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  user_type: z.enum(["founder", "business", "investor", "customer"]),
});

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { session, user, profile } = useAuth();

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile?.name || "",
      title: "",
      bio: "",
      location: "",
      website: "",
      twitter: "",
      linkedin: "",
      github: "",
    },
  });

  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: user?.email || "",
      user_type: "founder",
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!session) {
      router.push("/sign-in");
    }
  }, [session, router]);

  // Fetch profile data and set form values
  useEffect(() => {
    if (user && session) {
      const supabase = createClient();
      supabase
        .from("profiles")
        .select("name, title, bio, location, website, twitter, linkedin, github, user_type")
        .eq("id", user.id)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            profileForm.reset({
              name: data.name || "",
              title: data.title || "",
              bio: data.bio || "",
              location: data.location || "",
              website: data.website || "",
              twitter: data.twitter || "",
              linkedin: data.linkedin || "",
              github: data.github || "",
            });
            accountForm.reset({
              email: user.email || "",
              user_type: data.user_type || "founder",
            });
          }
        });
    }
  }, [user, session, profileForm, accountForm]);

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsLoading(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user?.id,
        ...values,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated successfully",
      });
    }
    setIsLoading(false);
  }

  async function onAccountSubmit(values: z.infer<typeof accountFormSchema>) {
    setIsLoading(true);
    const supabase = createClient();

    // Update email in auth.users
    const { error: authError } = await supabase.auth.updateUser({
      email: values.email,
    });

    // Update user_type in profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        user_type: values.user_type,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user?.id);

    if (authError || profileError) {
      toast({
        title: "Error updating account",
        description: authError?.message || profileError?.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account updated successfully",
      });
    }
    setIsLoading(false);
  }

  if (!session) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/4">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg?height=96&width=96"} alt={profile?.name || "User"} />
                  <AvatarFallback>{profile?.name?.slice(0, 2).toUpperCase() || "JD"}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h2 className="text-2xl font-bold">{profile?.name || "User"}</h2>
                  <p className="text-muted-foreground">{profileForm.getValues("title") || "No title"}</p>
                </div>
                <Badge>Verified Profile</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profileForm.getValues("title") || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profileForm.getValues("location") || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <a href={profileForm.getValues("website") || "#"} className="text-sm text-primary hover:underline">
                    {profileForm.getValues("website") || "No website"}
                  </a>
                </div>
                <Separator />
                <div className="flex justify-center space-x-4">
                  {profileForm.getValues("twitter") && (
                    <a href={`https://twitter.com/${profileForm.getValues("twitter")}`} className="text-muted-foreground hover:text-primary">
                      <Twitter className="h-5 w-5" />
                      <span className="sr-only">Twitter</span>
                    </a>
                  )}
                  {profileForm.getValues("linkedin") && (
                    <a href={`https://linkedin.com/in/${profileForm.getValues("linkedin")}`} className="text-muted-foreground hover:text-primary">
                      <Linkedin className="h-5 w-5" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  )}
                  {profileForm.getValues("github") && (
                    <a href={`https://github.com/${profileForm.getValues("github")}`} className="text-muted-foreground hover:text-primary">
                      <Github className="h-5 w-5" />
                      <span className="sr-only">GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col space-y-1 px-2 py-2">
                  <Button
                    variant={activeTab === "profile" ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant={activeTab === "account" ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab("account")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Account
                  </Button>
                  <Button
                    variant={activeTab === "notifications" ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                  <Button
                    variant={activeTab === "security" ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveTab("security")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Security
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
        </aside>
        <div className="flex-1 lg:max-w-3xl">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:hidden">
              <TabsTrigger value="profile" onClick={() => setActiveTab("profile")}>
                Profile
              </TabsTrigger>
              <TabsTrigger value="account" onClick={() => setActiveTab("account")}>
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" onClick={() => setActiveTab("notifications")}>
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" onClick={() => setActiveTab("security")}>
                Security
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className={activeTab === "profile" ? "" : "hidden"}>
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your public profile information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="relative">
                            <Avatar className="h-24 w-24">
                              <AvatarImage src={profile?.avatar_url || "/placeholder.svg?height=96&width=96"} alt={profile?.name || "User"} />
                              <AvatarFallback>{profile?.name?.slice(0, 2).toUpperCase() || "JD"}</AvatarFallback>
                            </Avatar>
                            <Button
                              size="icon"
                              variant="outline"
                              className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                              disabled
                            >
                              <Upload className="h-4 w-4" />
                              <span className="sr-only">Upload profile picture</span>
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max. (Upload disabled)</p>
                        </div>
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Startup Founder" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Tell us about yourself" className="resize-none" {...field} />
                              </FormControl>
                              <FormDescription>{field.value?.length || 0}/500 characters</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="San Francisco, CA" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid gap-4 md:grid-cols-3">
                          <FormField
                            control={profileForm.control}
                            name="twitter"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Twitter</FormLabel>
                                <FormControl>
                                  <div className="flex items-center">
                                    <span className="mr-2 text-muted-foreground">@</span>
                                    <Input placeholder="johndoe" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="linkedin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn</FormLabel>
                                <FormControl>
                                  <div className="flex items-center">
                                    <span className="mr-2 text-muted-foreground">in/</span>
                                    <Input placeholder="johndoe" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="github"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>GitHub</FormLabel>
                                <FormControl>
                                  <div className="flex items-center">
                                    <span className="mr-2 text-muted-foreground">@</span>
                                    <Input placeholder="johndoe" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span className="ml-2">Saving...</span>
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="account" className={activeTab === "account" ? "" : "hidden"}>
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Manage your account settings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...accountForm}>
                    <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <FormField
                          control={accountForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john.doe@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={accountForm.control}
                          name="user_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>User Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select user type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="founder">Startup Founder</SelectItem>
                                  <SelectItem value="business">Business Owner</SelectItem>
                                  <SelectItem value="investor">Investor</SelectItem>
                                  <SelectItem value="customer">Customer</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span className="ml-2">Saving...</span>
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive" disabled>
                      Delete Account
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className={activeTab === "notifications" ? "" : "hidden"}>
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage your notification preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="space-y-4">
                      {["New messages", "New connections", "Event reminders", "Platform updates"].map((item) => (
                        <div key={item} className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">{item}</div>
                            <div className="text-xs text-muted-foreground">
                              Receive notifications about {item.toLowerCase()}.
                            </div>
                          </div>
                          <Checkbox defaultChecked={true} />
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <h3 className="text-lg font-medium">Push Notifications</h3>
                    <div className="space-y-4">
                      {["New messages", "New connections", "Event reminders", "Platform updates"].map((item) => (
                        <div key={item} className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">{item}</div>
                            <div className="text-xs text-muted-foreground">
                              Receive push notifications about {item.toLowerCase()}.
                            </div>
                          </div>
                          <Checkbox defaultChecked={true} />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="security" className={activeTab === "security" ? "" : "hidden"}>
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your security settings and connected devices.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <FormLabel htmlFor="current-password">Current Password</FormLabel>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="grid gap-2">
                        <FormLabel htmlFor="new-password">New Password</FormLabel>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="grid gap-2">
                        <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    <Button disabled>Update Password</Button>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <Button variant="outline" disabled>Enable 2FA</Button>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Active Sessions</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Current Session</div>
                          <div className="text-xs text-muted-foreground">
                            San Francisco, CA • Chrome on macOS • May 15, 2025
                          </div>
                        </div>
                        <Badge>Current</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Mobile App</div>
                          <div className="text-xs text-muted-foreground">San Francisco, CA • iOS 18 • May 14, 2025</div>
                        </div>
                        <Button variant="outline" size="sm" disabled>
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
