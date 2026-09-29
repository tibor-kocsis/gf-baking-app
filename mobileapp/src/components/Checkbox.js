import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { Icon } from './Icon';

// Display-only tick box; the row around it handles the tap. `round` marks a
// whole step, square an ingredient.
export function Checkbox({ checked, round }) {
  return (
    <View style={[round ? styles.round : styles.square, checked && styles.checked]}>
      {checked && <Icon name="check" size={round ? 18 : 16} color={colors.onPrimary} strokeWidth={3} />}
    </View>
  );
}

const styles = StyleSheet.create({
  round: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
