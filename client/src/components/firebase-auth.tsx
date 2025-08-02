import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FirebaseAuthProps {
  onAuthSuccess?: () => void;
}

export default function FirebaseAuth({ onAuthSuccess }: FirebaseAuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Успех!",
        description: "Вы успешно вошли в аккаунт",
      });
      onAuthSuccess?.();
    } catch (error: any) {
      toast({
        title: "Ошибка входа",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Успех!",
        description: "Аккаунт создан успешно",
      });
      onAuthSuccess?.();
    } catch (error: any) {
      toast({
        title: "Ошибка регистрации",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Вы вышли из аккаунта",
        description: "До свидания!",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Firebase Аутентификация</CardTitle>
        <CardDescription>
          Войдите или зарегистрируйтесь с помощью Firebase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Вход</TabsTrigger>
            <TabsTrigger value="signup">Регистрация</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Входим..." : "Войти"}
              </Button>
            </form>
            
            <div className="space-y-2 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Тестовые аккаунты:</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setEmail("admin@contenthub.com");
                  setPassword("admin123");
                }}
              >
                Админ аккаунт
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setEmail("user@contenthub.com");
                  setPassword("user123");
                }}
              >
                Пользователь аккаунт
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Регистрируемся..." : "Зарегистрироваться"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="pt-4 mt-4 border-t">
          <Button onClick={handleSignOut} variant="outline" className="w-full">
            Выйти из аккаунта
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}