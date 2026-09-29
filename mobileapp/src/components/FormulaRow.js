import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

// Ingredient row for the flour mix formula: the same anatomy as IngredientRow,
// with the baker's percentage beside the gram weight and an optional hint line.
export function FormulaRow({ name, percent, amount, unit, hint }) {
  return (
    <View style={styles.formulaRow}>
      <View style={styles.rowLabels}>
        <Text style={styles.rowName}>{name}</Text>
        {!!hint && <Text style={styles.rowHint}>{hint}</Text>}
      </View>
      <View style={styles.rowRight}>
        {percent !== undefined && percent !== null && (
          <Text style={styles.rowPercent}>{percent}%</Text>
        )}
        <Text style={styles.rowAmount}>
          {amount}
          <Text style={styles.rowUnit}>{unit}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formulaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: 12,
  },
  rowLabels: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  rowHint: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  rowPercent: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  rowAmount: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  rowUnit: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
});
