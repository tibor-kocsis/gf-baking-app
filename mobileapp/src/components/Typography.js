import { Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

// The few text roles the screens share.

export function SectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

// One line of context under a section title.
export function SectionHint({ children }) {
  return <Text style={styles.sectionHint}>{children}</Text>;
}

// The small red uppercase label at the top of a card.
export function CategoryTitle({ children }) {
  return <Text style={styles.categoryTitle}>{children}</Text>;
}

// Secondary text inside a card, under the thing it explains.
export function Hint({ children, style }) {
  return <Text style={[styles.hint, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 22,
    fontFamily: fonts.display,
    color: colors.text,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionHint: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: -4,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  categoryTitle: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: 12,
  },
});
