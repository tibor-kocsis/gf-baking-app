import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { Icon } from './Icon';

// Multi-select picks: [{ key, label }], `selected` is the list of picked keys.
export function ChipGroup({ options, selected, onToggle }) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = selected.indexOf(option.key) !== -1;
        return (
          <Pressable
            key={option.key}
            style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.pressed]}
            onPress={() => onToggle(option.key)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: active }}
          >
            {active && <Icon name="check" size={16} color={colors.primaryOnSoft} strokeWidth={2.6} />}
            <Text style={[styles.text, active && styles.textActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    paddingLeft: 12,
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  textActive: {
    fontFamily: fonts.bold,
    color: colors.primaryOnSoft,
  },
});
