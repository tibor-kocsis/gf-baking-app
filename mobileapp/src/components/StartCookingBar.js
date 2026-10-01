import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useBottomInset } from '../hooks/useBottomInset';
import { Icon } from './Icon';

// Pinned under a recipe screen's scroll view, so cooking mode is always one tap away.
export function StartCookingBar({ label, onPress }) {
  const paddingBottom = useBottomInset(12);
  return (
    <View style={[styles.bar, { paddingBottom }]}>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
      >
        <Icon name="play" size={20} color={colors.onPrimary} />
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 4,
  },
  pressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.onPrimary,
  },
});
