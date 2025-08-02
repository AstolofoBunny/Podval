import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useLocation } from "wouter";

interface BackButtonProps {
  to?: string;
  label?: string;
  variant?: "default" | "outline" | "ghost";
}

export default function BackButton({ to = "/", label = "Вернуться на главную", variant = "outline" }: BackButtonProps) {
  const [, navigate] = useLocation();

  return (
    <Button 
      variant={variant} 
      onClick={() => navigate(to)}
      className="mb-4"
    >
      {to === "/" ? (
        <Home className="w-4 h-4 mr-2" />
      ) : (
        <ArrowLeft className="w-4 h-4 mr-2" />
      )}
      {label}
    </Button>
  );
}