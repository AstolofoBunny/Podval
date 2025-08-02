import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/useLanguage";

export default function AccountSwitcher() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [currentRole, setCurrentRole] = useState<'user' | 'admin'>('user');

  const switchAccountMutation = useMutation({
    mutationFn: async (role: 'user' | 'admin') => {
      const response = await fetch('/api/auth/switch-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to switch account');
      }
      
      return response.json();
    },
    onSuccess: (data, role) => {
      setCurrentRole(role);
      toast({
        title: t('success'),
        description: `Switched to ${role} account`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      window.location.reload(); // Reload to refresh all data
    },
    onError: () => {
      toast({
        title: t('error'),
        description: "Failed to switch account",
        variant: "destructive",
      });
    },
  });

  const handleSwitch = (role: 'user' | 'admin') => {
    switchAccountMutation.mutate(role);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('accountSwitcher')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Current role: <span className="font-medium capitalize">{currentRole}</span>
        </div>
        
        <div className="space-y-2">
          <Button 
            variant={currentRole === 'user' ? 'default' : 'outline'}
            size="sm" 
            className="w-full justify-start"
            onClick={() => handleSwitch('user')}
            disabled={switchAccountMutation.isPending || currentRole === 'user'}
          >
            👤 {t('switchToUser')}
          </Button>
          
          <Button 
            variant={currentRole === 'admin' ? 'default' : 'outline'}
            size="sm" 
            className="w-full justify-start"
            onClick={() => handleSwitch('admin')}
            disabled={switchAccountMutation.isPending || currentRole === 'admin'}
          >
            ⚡ {t('switchToAdmin')}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Test accounts: user@contenthub.com / admin@contenthub.com
        </div>
      </CardContent>
    </Card>
  );
}