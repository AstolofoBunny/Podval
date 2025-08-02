import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/queryClient";
import type { PostWithDetails, Comment, User } from "@shared/schema";

export default function PostDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  const { data: post, isLoading } = useQuery<PostWithDetails>({
    queryKey: ["/api/posts", id],
    enabled: !!id,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) {
        throw new Error("Please sign in to like posts");
      }
      return apiRequest("POST", `/api/posts/${id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", id] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!isAuthenticated) {
        throw new Error("Please sign in to comment");
      }
      return apiRequest("POST", `/api/posts/${id}/comments`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", id] });
      setComment("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    commentMutation.mutate(comment);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 animate-pulse">
            <div className="w-full h-64 bg-slate-200"></div>
            <div className="p-8">
              <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-slate-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <h1 className="text-2xl font-bold text-slate-900">Post not found</h1>
              <p className="text-slate-600 mt-2">The post you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Cover Image */}
          {post.coverImage && (
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-64 object-cover"
            />
          )}
          
          <div className="p-8">
            {/* Category Badge */}
            <Badge className="mb-4" style={{ backgroundColor: `var(--${post.category.color}-100)`, color: `var(--${post.category.color}-800)` }}>
              {post.category.name}
            </Badge>

            {/* Title */}
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{post.title}</h1>

            {/* Author and Meta */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={post.author.profileImageUrl || undefined} />
                  <AvatarFallback>
                    {(post.author.firstName?.[0] || '') + (post.author.lastName?.[0] || '')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-900">
                    {post.author.firstName} {post.author.lastName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(post.createdAt || '').toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-slate-500">
                <span className="flex items-center">
                  <i className="fas fa-eye mr-1"></i>
                  {post.viewCount}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                  className={`flex items-center ${post.isLiked ? 'text-red-500 hover:text-red-600' : 'text-slate-500 hover:text-red-500'}`}
                >
                  <i className={`fas fa-heart mr-1 ${post.isLiked ? 'text-red-500' : ''}`}></i>
                  {post.likeCount}
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-8">
              <div className="whitespace-pre-wrap">{post.content}</div>
            </div>

            {/* Files */}
            {post.files.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Attachments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.files.map((file) => (
                    <a
                      key={file.id}
                      href={`/uploads/${file.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <i className="fas fa-file mr-3 text-slate-400"></i>
                      <div>
                        <p className="font-medium text-slate-900">{file.originalName}</p>
                        <p className="text-sm text-slate-500">
                          {Math.round(file.size / 1024)} KB
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Comments ({post.comments.length})
              </h3>

              {/* Add Comment Form */}
              {isAuthenticated ? (
                <form onSubmit={handleComment} className="mb-6">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="mb-3"
                  />
                  <Button 
                    type="submit" 
                    disabled={!comment.trim() || commentMutation.isPending}
                  >
                    {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
                  </Button>
                </form>
              ) : (
                <div className="mb-6 p-4 bg-slate-50 rounded-lg text-center">
                  <p className="text-slate-600 mb-2">Sign in to leave a comment</p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/api/login'}
                  >
                    Sign In
                  </Button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {post.comments.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No comments yet.</p>
                ) : (
                  post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3 p-4 bg-slate-50 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.author.profileImageUrl || undefined} />
                        <AvatarFallback className="text-xs">
                          {(comment.author.firstName?.[0] || '') + (comment.author.lastName?.[0] || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-sm">
                            {comment.author.firstName} {comment.author.lastName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(comment.createdAt || '').toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-slate-700">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
