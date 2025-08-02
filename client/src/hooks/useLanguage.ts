import { useState, useEffect } from 'react';

export type Language = 'en' | 'ru';

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    contact: 'Contact',
    profile: 'Profile',
    create: 'Create',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    
    // Content
    createPost: 'Create Post',
    createArticle: 'Create Article',
    myPosts: 'My Posts',
    getStarted: 'Get Started',
    posts: 'Posts',
    articles: 'Articles',
    
    // Forms
    title: 'Title',
    description: 'Description',
    content: 'Content',
    category: 'Category',
    save: 'Save',
    cancel: 'Cancel',
    name: 'Name',
    color: 'Color',
    
    // Messages
    success: 'Success!',
    error: 'Error',
    loading: 'Loading...',
    
    // Settings
    language: 'Language',
    settings: 'Settings',
    english: 'English',
    russian: 'Русский',
    
    // Admin
    admin: 'Admin',
    createCategory: 'Create Category',
    categories: 'Categories',
    switchToAdmin: 'Switch to Admin',
    switchToUser: 'Switch to User',
    accountSwitcher: 'Account Switcher'
  },
  ru: {
    // Navigation
    home: 'Главная',
    about: 'О нас',
    contact: 'Контакты',
    profile: 'Профиль',
    create: 'Создать',
    signIn: 'Войти',
    signOut: 'Выйти',
    
    // Content
    createPost: 'Создать пост',
    createArticle: 'Создать статью',
    myPosts: 'Мои посты',
    getStarted: 'Начать',
    posts: 'Посты',
    articles: 'Статьи',
    
    // Forms
    title: 'Заголовок',
    description: 'Описание',
    content: 'Содержание',
    category: 'Категория',
    save: 'Сохранить',
    cancel: 'Отмена',
    name: 'Название',
    color: 'Цвет',
    
    // Messages
    success: 'Успех!',
    error: 'Ошибка',
    loading: 'Загрузка...',
    
    // Settings
    language: 'Язык',
    settings: 'Настройки',
    english: 'English',
    russian: 'Русский',
    
    // Admin
    admin: 'Админ',
    createCategory: 'Создать категорию',
    categories: 'Категории',
    switchToAdmin: 'Переключить на админа',
    switchToUser: 'Переключить на пользователя',
    accountSwitcher: 'Переключатель аккаунтов'
  }
};

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ru';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };

  return {
    language,
    setLanguage,
    t
  };
}