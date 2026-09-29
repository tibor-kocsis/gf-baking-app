import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

// Single choice among a few short values in one row: [{ key, label }].
export function SegmentedControl({ options, value, onChange }) {
  return (
    <View style={styles.track}>
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            style={({ pressed }) => [styles.segment, active && styles.segmentActive, pressed && styles.pressed]}
            onPress={() => onChange(option.key)}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
          >
            <Text style={[styles.text, active && styles.textActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
  },
  segment: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.textSecondary,
  },
  textActive: {
    fontFamily: fonts.extrabold,
    color: colors.text,
  },
});
