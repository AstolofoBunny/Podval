import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search query:", searchQuery);
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <h1 className="text-2xl font-bold text-brand-700 cursor-pointer">ContentHub</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-700 hover:text-brand-600 font-medium transition-colors">
              Home
            </Link>
            <span className="text-slate-700 hover:text-brand-600 font-medium transition-colors cursor-pointer">
              Categories
            </span>
            <Link href="/about" className="text-slate-700 hover:text-brand-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-slate-700 hover:text-brand-600 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64"
                />
                <i className="fas fa-search absolute left-3 top-3 text-slate-400"></i>
              </form>
            </div>

            {isAuthenticated ? (
              <>
                {/* Create Post Button */}
                <Button onClick={() => navigate("/create")}>
                  <i className="fas fa-plus mr-2"></i>
                  Create
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={(user as any)?.profileImageUrl || undefined} />
                        <AvatarFallback>
                          {((user as any)?.firstName?.[0] || '') + ((user as any)?.lastName?.[0] || '')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block">
                        {(user as any)?.firstName} {(user as any)?.lastName}
                      </span>
                      <i className="fas fa-chevron-down text-xs"></i>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <i className="fas fa-user mr-2"></i>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/my-posts")}>
                      <i className="fas fa-file-alt mr-2"></i>
                      My Posts
                    </DropdownMenuItem>
                    {(user as any)?.isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/admin")}>
                          <i className="fas fa-cog mr-2"></i>
                          Admin Panel
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => window.location.href = '/api/login'}>
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <i className="fas fa-bars"></i>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-4">
                  <Link href="/" className="text-slate-700 hover:text-brand-600 font-medium">
                    Home
                  </Link>
                  <span className="text-slate-700 hover:text-brand-600 font-medium cursor-pointer">
                    Categories
                  </span>
                  <Link href="/about" className="text-slate-700 hover:text-brand-600 font-medium">
                    About
                  </Link>
                  <Link href="/contact" className="text-slate-700 hover:text-brand-600 font-medium">
                    Contact
                  </Link>
                  
                  {isAuthenticated && (
                    <>
                      <div className="border-t pt-4">
                        <Button onClick={() => navigate("/create")} className="w-full mb-2">
                          <i className="fas fa-plus mr-2"></i>
                          Create
                        </Button>
                        {(user as any)?.isAdmin && (
                          <Button 
                            variant="outline" 
                            onClick={() => navigate("/admin")} 
                            className="w-full"
                          >
                            <i className="fas fa-cog mr-2"></i>
                            Admin Panel
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
