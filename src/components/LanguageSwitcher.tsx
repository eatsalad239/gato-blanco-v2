import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguageStore, languages, translations } from '../lib/translations';
import { Globe } from '@phosphor-icons/react';

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const t = translations[currentLanguage?.code || 'en'];

  const toggleLanguage = () => {
    const nextLanguage = languages.find(lang => lang.code !== (currentLanguage?.code || 'en')) || languages[0];
    setLanguage(nextLanguage);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="gap-2 border-primary/20 hover:border-primary hover:bg-primary/5"
    >
      <Globe size={16} />
      <span className="text-sm font-medium">{currentLanguage?.flag || '🇺🇸'}</span>
      <span className="text-sm">{currentLanguage?.name || 'English'}</span>
    </Button>
  );
};