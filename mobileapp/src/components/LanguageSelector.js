import { useState } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useI18n, LANGUAGES } from '../context/I18nContext';
import { Icon } from './Icon';
import { BottomSheet } from './BottomSheet';

export function LanguageSelector() {
  const { language, changeLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const current = LANGUAGES.find((lang) => lang.code === language);

  const handleSelect = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
        onPress={() => setIsOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={current ? current.name : t('common.selectLanguage')}
      >
        <Icon name="globe" size={18} color={colors.text} />
        <Text style={styles.triggerText}>{language.toUpperCase()}</Text>
      </Pressable>

      <BottomSheet
        visible={isOpen}
        title={t('common.selectLanguage')}
        options={LANGUAGES.map((lang) => ({ key: lang.code, label: lang.name, active: lang.code === language }))}
        onSelect={handleSelect}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  triggerText: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
});
