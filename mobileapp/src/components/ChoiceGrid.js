import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { pressedStyle } from '../constants/pressed';
import { fonts } from '../constants/fonts';
import { Icon } from './Icon';

// Single choice as a two-column grid of large buttons: [{ key, label }].
// `multiple`: value is an array and a tap toggles a key; the last one stays on.
export function ChoiceGrid({ options, value, onChange, multiple = false }) {
  const handlePress = (key) => {
    if (!multiple) return onChange(key);
    if (!value.includes(key)) return onChange([...value, key]);
    if (value.length > 1) onChange(value.filter((item) => item !== key));
  };
  return (
    <View style={styles.grid}>
      {options.map((option) => {
        const active = multiple ? value.includes(option.key) : option.key === value;
        return (
          <Pressable
            key={option.key}
            style={({ pressed }) => [styles.option, active && styles.optionActive, pressed && pressedStyle]}
            onPress={() => handlePress(option.key)}
            accessibilityRole={multiple ? 'checkbox' : 'radio'}
            accessibilityState={{ checked: active }}
          >
            {active && <Icon name="check" size={18} color={colors.onInverse} strokeWidth={2.4} />}
            <Text style={[styles.text, active && styles.textActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionActive: {
    backgroundColor: colors.inverse,
    borderColor: colors.inverse,
  },
  text: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  textActive: {
    fontFamily: fonts.bold,
    color: colors.onInverse,
  },
});
