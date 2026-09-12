import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

// Ingredient row for the flour mix formula: the same anatomy as IngredientRow,
// with the baker's percentage beside the gram weight and an optional hint line.
export function FormulaRow({ name, percent, amount, unit, emoji, hint }) {
  return (
    <View style={styles.formulaRow}>
      <View style={styles.rowLeft}>
        {!!emoji && <Text style={styles.rowEmoji}>{emoji}</Text>}
        <View style={styles.rowLabels}>
          <Text style={styles.rowName}>{name}</Text>
          {!!hint && <Text style={styles.rowHint}>{hint}</Text>}
        </View>
      </View>
      <View style={styles.rowRight}>
        {percent !== undefined && percent !== null && (
          <Text style={styles.rowPercent}>{percent}%</Text>
        )}
        <Text style={styles.rowAmount}>
          {amount}{unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formulaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  rowLabels: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    fontSize: 16,
    color: colors.text,
  },
  rowHint: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  rowPercent: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  rowAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
