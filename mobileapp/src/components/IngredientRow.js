import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export function IngredientRow({ name, amount, unit, emoji }) {
  return (
    <View style={styles.ingredientRow}>
      <View style={styles.ingredientLeft}>
        <Text style={styles.ingredientEmoji}>{emoji}</Text>
        <Text style={styles.ingredientName}>{name}</Text>
      </View>
      <Text style={styles.ingredientAmount}>
        {amount}{unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ingredientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ingredientEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  ingredientName: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  ingredientAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
