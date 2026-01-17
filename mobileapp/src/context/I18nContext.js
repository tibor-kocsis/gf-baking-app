import { useState, useEffect, createContext, useContext } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../../locales/en';
import hu from '../../locales/hu';
import { LANGUAGE_STORAGE_KEY } from '../constants/storage';

const translations = { en, hu };

const I18nContext = createContext();

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && translations[savedLanguage]) {
        setLanguage(savedLanguage);
      } else {
        const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
        const detectedLanguage = translations[deviceLocale] ? deviceLocale : 'en';
        setLanguage(detectedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      } catch (error) {
        console.error('Error saving language:', error);
      }
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  if (isLoading) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}
