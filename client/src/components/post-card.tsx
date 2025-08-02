import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { PostWithDetails } from "@shared/schema";

interface PostCardProps {
  post: PostWithDetails;
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return "1 day ago";
    return date.toLocaleDateString();
  };

  const getCategoryColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      purple: "bg-purple-100 text-purple-800",
      orange: "bg-orange-100 text-orange-800",
      red: "bg-red-100 text-red-800",
      yellow: "bg-yellow-100 text-yellow-800",
    };
    return colorMap[color] || "bg-gray-100 text-gray-800";
  };

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-slate-200">
      {/* Cover Image */}
      {post.coverImage ? (
        <img 
          src={post.coverImage} 
          alt={post.title}
          className="w-full h-48 object-cover" 
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <i className="fas fa-image text-slate-400 text-4xl"></i>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge className={`text-xs font-medium px-2.5 py-0.5 ${getCategoryColorClass(post.category.color)}`}>
            {post.category.name}
          </Badge>
          <span className="text-slate-500 text-sm">{formatDate(post.createdAt)}</span>
        </div>
        
        <Link href={`/post/${post.id}`}>
          <h3 className="text-xl font-semibold text-slate-900 mb-2 line-clamp-2 hover:text-brand-600 transition-colors cursor-pointer">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-slate-600 mb-4 line-clamp-3">
          {post.shortDescription}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={post.author.profileImageUrl || undefined} />
              <AvatarFallback className="text-xs">
                {(post.author.firstName?.[0] || '') + (post.author.lastName?.[0] || '')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-slate-700">
              {post.author.firstName} {post.author.lastName}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-slate-500 text-sm">
            <span className="flex items-center">
              <i className="fas fa-eye mr-1"></i>
              <span>{post.viewCount}</span>
            </span>
            <span className="flex items-center">
              <i className="fas fa-heart mr-1"></i>
              <span>{post.likeCount}</span>
            </span>
            <span className="flex items-center">
              <i className="fas fa-comment mr-1"></i>
              <span>{post.comments.length}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
