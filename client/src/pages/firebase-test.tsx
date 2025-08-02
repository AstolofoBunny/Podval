import FirebaseAuth from "@/components/firebase-auth";
import BackButton from "@/components/back-button";

export default function FirebaseTest() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-2xl">
        <BackButton />
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Firebase Аутентификация
          </h1>
          <p className="text-muted-foreground">
            Тестирование Firebase входа и регистрации
          </p>
        </div>

        <FirebaseAuth 
          onAuthSuccess={() => {
            console.log("Firebase auth successful!");
          }}
        />
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Тестовые аккаунты:</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Админ:</strong> admin@contenthub.com / admin123
            </div>
            <div>
              <strong>Пользователь:</strong> user@contenthub.com / user123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}