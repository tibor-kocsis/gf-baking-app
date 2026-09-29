import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

// One weighed line: name (with an optional hint under it), an optional baker's
// percentage, and the amount with its already formatted unit.
export function IngredientRow({ name, hint, percent, amount, unit, last }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <View style={styles.labels}>
        <Text style={styles.name}>{name}</Text>
        {!!hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
      <View style={styles.values}>
        {percent !== undefined && percent !== null && <Text style={styles.percent}>{percent}%</Text>}
        <Text style={styles.amount}>
          {amount}
          <Text style={styles.unit}>{unit}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  labels: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  hint: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  values: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  percent: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  amount: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
});
