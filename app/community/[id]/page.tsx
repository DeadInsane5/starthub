"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Heart, MessageCircle, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Post {
  id: string;
  author: { name: string; avatar: string; title: string; company?: string };
  content: string;
  image?: string;
  time?: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  created_at: string;
  updated_at?: string;
}

interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  author: { name: string; avatar?: string; title?: string; company?: string };
  content: string;
  likes: number;
  created_at: string;
  children?: Comment[];
}

export default function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      const supabase = createClient();
      try {
        // Fetch post
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select(`
            id,
            author,
            content,
            image,
            time,
            likes,
            comments,
            shares,
            tags,
            created_at,
            updated_at
          `)
          .eq("id", id)
          .single();

        if (postError) {
          throw new Error(`Error fetching post: ${postError.message}`);
        }

        if (!postData) {
          throw new Error("Post not found");
        }

        setPost(postData);

        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select(`
            id,
            post_id,
            parent_id,
            author,
            content,
            likes,
            created_at
          `)
          .eq("post_id", id)
          .order("created_at", { ascending: true });

        if (commentsError) {
          throw new Error(`Error fetching comments: ${commentsError.message}`);
        }

        // Build comment tree
        const commentMap: { [key: string]: Comment } = {};
        const rootComments: Comment[] = [];

        commentsData?.forEach((comment) => {
          comment.children = [];
          commentMap[comment.id] = comment;
          if (!comment.parent_id) {
            rootComments.push(comment);
          } else {
            const parent = commentMap[comment.parent_id];
            if (parent) {
              parent.children!.push(comment);
            }
          }
        });

        setComments(rootComments);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  if (loading) {
    return <div className="container py-10">Loading...</div>;
  }

  if (error || !post) {
    return <div className="container py-10">Error: {error || "Post not found"}</div>;
  }

  const renderComment = (comment: Comment, depth = 0) => (
    <div key={comment.id} className={`ml-${depth * 4} mt-4`}>
      <div className="flex space-x-3">
        <div className="relative h-10 w-10">
          <Image
            src={comment.author.avatar || "/placeholder.svg"}
            alt={comment.author.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <p className="font-semibold">{comment.author.name}</p>
            <p className="text-sm text-muted-foreground">
              {comment.author.title} {comment.author.company ? `at ${comment.author.company}` : ""}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          </div>
          <p className="mt-1">{comment.content}</p>
          <div className="mt-2 flex space-x-4">
            <Button variant="ghost" size="sm">
              <Heart className="mr-2 h-4 w-4" />
              {comment.likes}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="mr-2 h-4 w-4" />
              Reply
            </Button>
          </div>
          {comment.children && comment.children.length > 0 && (
            <div className="mt-4">
              {comment.children.map((child) => renderComment(child, depth + 1))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/community" className="flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Community
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="relative h-10 w-10">
                  <Image
                    src={post.author.avatar || "/placeholder.svg?height=40&width=40"}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {post.author.title} {post.author.company ? `at ${post.author.company}` : ""}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="whitespace-pre-wrap">{post.content}</p>
              {post.image && (
                <div className="relative h-64 w-full overflow-hidden rounded-md">
                  <Image
                    src={post.image}
                    alt="Post image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {post.tags &&
                  post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Heart className="mr-2 h-4 w-4" />
                  {post.likes} Likes
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {post.comments} Comments
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  {post.shares} Shares
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              ) : (
                comments.map((comment) => renderComment(comment))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Posted</p>
                <p className="text-sm">
                  {post.time ||
                    new Date(post.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                </p>
              </div>
              {post.updated_at && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="text-sm">
                      {new Date(post.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
