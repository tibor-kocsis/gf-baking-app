import { Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { Card } from './Card';
import { Icon } from './Icon';

// Stands in for results that cannot be shown yet, and says what to do about it.
export function EmptyState({ icon, title, body }) {
  return (
    <Card style={styles.card}>
      <Icon name={icon} size={48} color={colors.primary} strokeWidth={1.5} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
});
