import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { Icon } from './Icon';

// A pick-one sheet from the bottom of the screen, the same on every platform
// (the web has no native action sheet). options: [{ key, label, active }].
// Tapping outside closes it.
export function BottomSheet({ visible, title, options, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Swallows taps so only the dimmed area closes the sheet. */}
        <Pressable style={styles.sheet} onPress={null}>
          <View style={styles.handle} />
          {!!title && <Text style={styles.title}>{title}</Text>}
          {options.map((option) => (
            <Pressable
              key={option.key}
              style={({ pressed }) => [
                styles.option,
                option.active && styles.optionActive,
                pressed && styles.pressed,
              ]}
              onPress={() => onSelect(option.key)}
              accessibilityRole="button"
            >
              <Text style={[styles.optionText, option.active && styles.optionTextActive]}>
                {option.label}
              </Text>
              {option.active && <Icon name="check" size={20} color={colors.onPrimary} strokeWidth={2.4} />}
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.display,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  optionActive: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  optionText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  optionTextActive: {
    fontFamily: fonts.bold,
    color: colors.onPrimary,
  },
});
