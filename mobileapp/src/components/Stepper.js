import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useI18n } from '../context/I18nContext';
import { stepUp, stepDown } from '../utils/stepper';
import { Icon } from './Icon';

// With a unit after it, the number field hugs its digits so "200 g" reads as one
// value. The display face runs up to ~20 px a digit at 30 px ("200" is 58 px), so
// a single 56 px field cut the first digit off on Android, which right-aligns and
// clips; the field widens by a digit's width instead.
function suffixWidth(value) {
  const digits = String(value || '').length;
  if (digits >= 5) return styles.inputWithSuffix5;
  if (digits === 4) return styles.inputWithSuffix4;
  if (digits === 3) return styles.inputWithSuffix3;
  return null;
}

// The count / batch-size card every calculator opens with. The value stays text
// so the baker can type; the buttons move it by `step`, never below `step`.
export function Stepper({ label, value, onChange, step = 1, suffix }) {
  const { t } = useI18n();
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable
          style={({ pressed }) => [styles.minusButton, pressed && styles.pressed]}
          onPress={() => onChange(stepDown(value, step, step))}
          accessibilityRole="button"
          accessibilityLabel={t('common.decrease')}
        >
          <Icon name="minus" size={24} color={colors.primary} strokeWidth={2.2} />
        </Pressable>
        <View style={styles.valueBox}>
          <TextInput
            style={[styles.input, !!suffix && styles.inputWithSuffix, !!suffix && suffixWidth(value)]}
            value={value}
            onChangeText={onChange}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel={label}
          />
          {!!suffix && <Text style={styles.suffix}>{suffix}</Text>}
        </View>
        <Pressable
          style={({ pressed }) => [styles.plusButton, pressed && styles.pressedPrimary]}
          onPress={() => onChange(stepUp(value, step))}
          accessibilityRole="button"
          accessibilityLabel={t('common.increase')}
        >
          <Icon name="plus" size={24} color={colors.onPrimary} strokeWidth={2.2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 20,
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  minusButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: colors.border,
    transform: [{ scale: 0.95 }],
  },
  pressedPrimary: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.95 }],
  },
  valueBox: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  input: {
    width: 96,
    // Android pads a TextInput unless told not to, which eats into the digits.
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontSize: 30,
    fontFamily: fonts.display,
    color: colors.text,
    textAlign: 'center',
  },
  // Number and unit read as one value: "2 batches".
  inputWithSuffix: {
    width: 56,
    textAlign: 'right',
  },
  inputWithSuffix3: {
    width: 64,
  },
  inputWithSuffix4: {
    width: 84,
  },
  inputWithSuffix5: {
    width: 104,
  },
  suffix: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
});
