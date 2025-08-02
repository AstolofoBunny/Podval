import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { Category, User } from "@shared/schema";

export default function Admin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryColor, setCategoryColor] = useState("blue");
  const [aboutUsContent, setAboutUsContent] = useState("");

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !(user as any)?.isAdmin)) {
      toast({
        title: "Unauthorized",
        description: "Admin access required. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      return;
    }
  }, [isAuthenticated, user, authLoading, toast]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated && (user as any)?.isAdmin,
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && (user as any)?.isAdmin,
  });

  const { data: aboutUsSetting } = useQuery({
    queryKey: ["/api/settings/about_us"],
    enabled: isAuthenticated && (user as any)?.isAdmin,
  });

  // Set about us content when data is loaded
  useEffect(() => {
    if (aboutUsSetting?.value) {
      setAboutUsContent(aboutUsSetting.value);
    }
  }, [aboutUsSetting]);

  const createCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; color: string }) => {
      return apiRequest("POST", "/api/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setCategoryName("");
      setCategoryDescription("");
      setCategoryColor("blue");
      toast({
        title: "Success",
        description: "Category created successfully!",
      });
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

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      return apiRequest("DELETE", `/api/categories/${categoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: "Category deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateUserAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      return apiRequest("PUT", `/api/admin/users/${userId}/admin`, { isAdmin });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "User admin status updated!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAboutUsMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("PUT", "/api/settings/about_us", { value: content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/about_us"] });
      toast({
        title: "Success",
        description: "About Us section updated!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive",
      });
      return;
    }
    createCategoryMutation.mutate({
      name: categoryName,
      description: categoryDescription,
      color: categoryColor,
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  const handleUpdateUserAdmin = (userId: string, isAdmin: boolean) => {
    updateUserAdminMutation.mutate({ userId, isAdmin });
  };

  const handleUpdateAboutUs = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutUsMutation.mutate(aboutUsContent);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !(user as any)?.isAdmin) {
    return null; // Will redirect via useEffect
  }

  const colorOptions = [
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
    { value: "orange", label: "Orange" },
    { value: "red", label: "Red" },
    { value: "yellow", label: "Yellow" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
        </div>

        <Tabs defaultValue="categories" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Create Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name *</Label>
                      <Input
                        id="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Enter category name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="categoryDescription">Description</Label>
                      <Textarea
                        id="categoryDescription"
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        placeholder="Enter category description"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="categoryColor">Color</Label>
                      <Select value={categoryColor} onValueChange={setCategoryColor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={createCategoryMutation.isPending}
                    >
                      {createCategoryMutation.isPending ? 'Creating...' : 'Create Category'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Existing Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Existing Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.length === 0 ? (
                      <p className="text-slate-500 text-center py-4">No categories yet.</p>
                    ) : (
                      categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className={`w-3 h-3 rounded-full bg-${category.color}-500`}
                            ></div>
                            <div>
                              <h4 className="font-medium text-slate-900">{category.name}</h4>
                              {category.description && (
                                <p className="text-sm text-slate-600">{category.description}</p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={deleteCategoryMutation.isPending}
                            className="text-red-600 hover:text-red-700"
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">No users found.</p>
                  ) : (
                    users.map((userItem) => (
                      <div key={userItem.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
                            {userItem.profileImageUrl ? (
                              <img 
                                src={userItem.profileImageUrl} 
                                alt="Profile" 
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <i className="fas fa-user text-slate-600"></i>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">
                              {userItem.firstName} {userItem.lastName}
                            </h4>
                            <p className="text-sm text-slate-600">{userItem.email}</p>
                            <p className="text-xs text-slate-500">
                              Joined {new Date(userItem.createdAt || '').toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {userItem.isAdmin && <Badge>Admin</Badge>}
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`admin-${userItem.id}`} className="text-sm">
                              Admin
                            </Label>
                            <Switch
                              id={`admin-${userItem.id}`}
                              checked={userItem.isAdmin || false}
                              onCheckedChange={(checked) => handleUpdateUserAdmin(userItem.id, checked)}
                              disabled={updateUserAdminMutation.isPending || userItem.id === (user as any)?.id}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateAboutUs} className="space-y-4">
                  <div>
                    <Label htmlFor="aboutUs">About Us Content</Label>
                    <Textarea
                      id="aboutUs"
                      value={aboutUsContent}
                      onChange={(e) => setAboutUsContent(e.target.value)}
                      placeholder="Enter about us content..."
                      rows={8}
                    />
                  </div>
                  <Button 
                    type="submit"
                    disabled={updateAboutUsMutation.isPending}
                  >
                    {updateAboutUsMutation.isPending ? 'Updating...' : 'Update About Us'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Post Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500">Post management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
