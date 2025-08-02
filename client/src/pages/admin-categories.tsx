import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import BackButton from "@/components/back-button";
import { useLanguage } from "@/hooks/useLanguage";

export default function AdminCategories() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "blue"
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated,
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('success'),
        description: "Category created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setFormData({ name: "", description: "", color: "blue" });
    },
    onError: () => {
      toast({
        title: t('error'),
        description: "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: t('error'),
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }
    
    createCategoryMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !(user as any)?.isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-slate-600">Admin access required</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Category Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createCategory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('name')}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Category name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">{t('description')}</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Category description"
                  />
                </div>
                
                <div>
                  <Label htmlFor="color">{t('color')}</Label>
                  <select
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                    <option value="gray">Gray</option>
                  </select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createCategoryMutation.isPending}
                >
                  {createCategoryMutation.isPending ? t('loading') : t('createCategory')}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Categories List */}
          <Card>
            <CardHeader>
              <CardTitle>{t('categories')}</CardTitle>
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <p>{t('loading')}</p>
              ) : categories && Array.isArray(categories) && categories.length > 0 ? (
                <div className="space-y-2">
                  {categories.map((category: any) => (
                    <div 
                      key={category.id}
                      className="p-3 border border-slate-200 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-slate-600">{category.description}</p>
                      </div>
                      <div 
                        className={`w-4 h-4 rounded-full bg-${category.color}-500`}
                        title={category.color}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">No categories found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}