import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import PostDetail from "@/pages/post-detail";
import CreatePost from "@/pages/create-post";
import CreateArticle from "@/pages/create-article";
import CreateContent from "@/pages/create-content";
import Profile from "@/pages/profile";
import MyPosts from "@/pages/my-posts";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";
import FirebaseTest from "@/pages/firebase-test";
import AdminCategories from "@/pages/admin-categories";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/post/:id" component={PostDetail} />
          <Route path="/create" component={CreateContent} />
          <Route path="/create-post" component={CreatePost} />
          <Route path="/create-article" component={CreateArticle} />
          <Route path="/profile" component={Profile} />
          <Route path="/my-posts" component={MyPosts} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/categories" component={AdminCategories} />
          <Route path="/firebase-test" component={FirebaseTest} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
