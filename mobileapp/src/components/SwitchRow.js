import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

// A labelled on/off switch; the whole row is the tap target. `divider` draws a
// line under it when more rows follow in the same card.
export function SwitchRow({ label, hint, value, onValueChange, divider }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, divider && styles.rowDivider, pressed && styles.pressed]}
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View style={styles.labels}>
        <Text style={styles.label}>{label}</Text>
        {!!hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.surface}
        // react-native-web colours the on-state thumb separately (teal by default)
        activeThumbColor={colors.surface}
        ios_backgroundColor={colors.border}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 8,
  },
  rowDivider: {
    paddingBottom: 14,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  pressed: {
    opacity: 0.7,
  },
  labels: {
    flex: 1,
    gap: 3,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  hint: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
