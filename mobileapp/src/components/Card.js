import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { layout } from '../constants/layout';

// The white rounded card every screen builds on.
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: layout.cardRadius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: layout.cardPadding,
    marginBottom: 12,
  },
});
