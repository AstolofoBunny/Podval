import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { isUnauthorizedError } from "@/lib/authUtils";
import BackButton from "@/components/back-button";

export default function MyPosts() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: myPosts, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/posts/my-posts"],
    enabled: isAuthenticated,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your posts...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Posts</h1>
            <p className="text-slate-600 mt-2">
              Manage your published content
            </p>
          </div>
          <div className="space-x-2">
            <Link href="/create">
              <Button>
                <i className="fas fa-plus mr-2"></i>
                Create Post
              </Button>
            </Link>
            <Link href="/create-article">
              <Button variant="outline">
                <i className="fas fa-newspaper mr-2"></i>
                Create Article
              </Button>
            </Link>
          </div>
        </div>

        {/* Posts Grid */}
        {!myPosts || (myPosts as any[]).length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <i className="fas fa-file-alt text-slate-300 text-6xl mb-4"></i>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No posts yet
              </h3>
              <p className="text-slate-600 mb-6">
                Start sharing your thoughts with the community
              </p>
              <div className="space-x-2">
                <Link href="/create">
                  <Button>
                    <i className="fas fa-plus mr-2"></i>
                    Create Your First Post
                  </Button>
                </Link>
                <Link href="/create-article">
                  <Button variant="outline">
                    <i className="fas fa-newspaper mr-2"></i>
                    Create Article
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {(myPosts as any[]).map((post: any) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                        <Badge variant="outline">
                          {post.category?.name || "Uncategorized"}
                        </Badge>
                        <Badge variant="outline">
                          {post.type || "post"}
                        </Badge>
                      </div>
                      
                      <Link href={`/post/${post.id}`}>
                        <h3 className="text-xl font-semibold text-slate-900 hover:text-brand-600 transition-colors cursor-pointer mb-2">
                          {post.title}
                        </h3>
                      </Link>
                      
                      <p className="text-slate-600 mb-3 line-clamp-2">
                        {post.shortDescription}
                      </p>
                      
                      <div className="flex items-center text-sm text-slate-500 space-x-4">
                        <span>
                          <i className="fas fa-calendar mr-1"></i>
                          {formatDate(post.createdAt)}
                        </span>
                        <span>
                          <i className="fas fa-eye mr-1"></i>
                          {post.viewCount || 0} views
                        </span>
                        <span>
                          <i className="fas fa-heart mr-1"></i>
                          {post.likeCount || 0} likes
                        </span>
                        <span>
                          <i className="fas fa-comment mr-1"></i>
                          {post.commentCount || 0} comments
                        </span>
                      </div>
                    </div>
                    
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-24 h-16 object-cover rounded ml-4"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <i className="fas fa-chart-line mr-1"></i>
                        Analytics
                      </Button>
                    </div>
                    
                    <Link href={`/post/${post.id}`}>
                      <Button size="sm">
                        <i className="fas fa-external-link-alt mr-1"></i>
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}