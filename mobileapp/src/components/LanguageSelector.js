import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { useI18n } from '../context/I18nContext';

export function LanguageSelector() {
  const { language, changeLanguage } = useI18n();

  return (
    <View style={styles.languageSelector}>
      <TouchableOpacity
        style={[
          styles.languageButton,
          language === 'en' && styles.languageButtonActive
        ]}
        onPress={() => changeLanguage('en')}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.languageButtonText,
          language === 'en' && styles.languageButtonTextActive
        ]}>EN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.languageButton,
          language === 'hu' && styles.languageButtonActive
        ]}
        onPress={() => changeLanguage('hu')}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.languageButtonText,
          language === 'hu' && styles.languageButtonTextActive
        ]}>HU</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  languageButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  languageButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  languageButtonTextActive: {
    color: '#fff',
  },
});
