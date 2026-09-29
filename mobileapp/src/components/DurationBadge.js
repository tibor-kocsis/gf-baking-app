import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useI18n } from '../context/I18nContext';
import { formatDuration } from '../utils/format';
import { Icon } from './Icon';

// How long a step takes. `large` is the arm's-length size used in cooking mode.
export function DurationBadge({ seconds, large }) {
  const { t } = useI18n();
  return (
    <View style={[styles.badge, large && styles.badgeLarge]}>
      <Icon name="timer" size={large ? 20 : 16} color={colors.primaryOnSoft} strokeWidth={2} />
      <Text style={[styles.text, large && styles.textLarge]}>{formatDuration(seconds, t)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
  },
  badgeLarge: {
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.primaryOnSoft,
  },
  textLarge: {
    fontSize: 17,
    fontFamily: fonts.bold,
  },
});
