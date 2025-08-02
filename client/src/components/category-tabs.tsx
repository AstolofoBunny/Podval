import { Button } from "@/components/ui/button";
import type { Category } from "@shared/schema";

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryTabs({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryTabsProps) {
  const tabs = [
    { id: "all", name: "All Posts" },
    { id: "featured", name: "Featured" },
    { id: "trending", name: "Trending" },
    { id: "recent", name: "Recent" },
  ];

  return (
    <div className="flex space-x-1 mb-8 bg-slate-100 p-1 rounded-lg w-fit">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          size="sm"
          onClick={() => onCategoryChange(tab.id)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            selectedCategory === tab.id
              ? 'bg-white text-brand-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {tab.name}
        </Button>
      ))}
    </div>
  );
}
