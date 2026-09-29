import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { Icon } from './Icon';

// Back button plus an optional centred title (the recipe screens put the name
// in their hero instead).
export function Header({ title, onBack }) {
  return (
    <View style={styles.headerBar}>
      <Pressable
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Icon name="back" size={22} color={colors.text} strokeWidth={2} />
      </Pressable>
      {!!title && (
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      )}
      {!!title && <View style={styles.headerSpacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
    transform: [{ scale: 0.96 }],
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
});
