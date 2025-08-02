import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PenTool } from "lucide-react";

export default function CreateContent() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Создать контент
            </h1>
            <p className="text-muted-foreground">
              Выберите тип контента, который вы хотите создать
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/create-post")}>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <PenTool className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Создать пост</CardTitle>
                <CardDescription>
                  Быстрый способ поделиться мыслями, новостями или обновлениями
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Краткий формат контента</li>
                  <li>• Идеально для новостей</li>
                  <li>• Быстрое создание</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/create-article")}>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-secondary-foreground" />
                </div>
                <CardTitle>Создать статью</CardTitle>
                <CardDescription>
                  Подробный контент с детальным освещением темы
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Развернутый формат</li>
                  <li>• Глубокое изучение темы</li>
                  <li>• Поддержка изображений</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => navigate("/")}>
              Вернуться на главную
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}