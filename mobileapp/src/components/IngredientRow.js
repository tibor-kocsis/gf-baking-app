import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

export function IngredientRow({ name, amount, unit, last }) {
  return (
    <View style={[styles.ingredientRow, last && styles.ingredientRowLast]}>
      <Text style={styles.ingredientName}>{name}</Text>
      <Text style={styles.ingredientAmount}>
        {amount}
        <Text style={styles.ingredientUnit}>{unit}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  ingredientRowLast: {
    borderBottomWidth: 0,
  },
  ingredientName: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  ingredientAmount: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  ingredientUnit: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
});
