import { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../../locales/en';
import hu from '../../locales/hu';
import de from '../../locales/de';
import { LANGUAGE_STORAGE_KEY } from '../constants/storage';
import { interpolate } from '../utils/format';

const translations = { en, hu, de };
const FALLBACK_LANGUAGE = 'en';

// The language picker's list, each name in its own language.
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hu', name: 'Magyar' },
  { code: 'de', name: 'Deutsch' },
];

const I18nContext = createContext(null);

export function useI18n() {
  return useContext(I18nContext);
}

function lookup(language, key) {
  return key.split('.').reduce((value, part) => (value ? value[part] : undefined), translations[language]);
}

// The saved choice wins; otherwise the device locale on first launch.
async function initialLanguage() {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && translations[saved]) return saved;
  } catch (error) {
    console.error('Error loading language:', error);
  }
  const deviceLanguage = Localization.getLocales()[0]?.languageCode;
  return translations[deviceLanguage] ? deviceLanguage : FALLBACK_LANGUAGE;
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(null);

  useEffect(() => {
    initialLanguage().then(setLanguage);
  }, []);

  const changeLanguage = useCallback(async (newLanguage) => {
    if (!translations[newLanguage]) return;
    setLanguage(newLanguage);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, []);

  // Strings, arrays (instructions, notes) and objects come back as stored; a
  // missing key comes back as itself so it is visible. `params` fill {name}
  // placeholders in strings.
  const t = useCallback(
    (key, params) => {
      const value = lookup(language, key) || lookup(FALLBACK_LANGUAGE, key) || key;
      return interpolate(value, params);
    },
    [language]
  );

  const value = useMemo(() => ({ language, changeLanguage, t }), [language, changeLanguage, t]);

  if (!language) return null;

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
