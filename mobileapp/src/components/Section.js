import { Animated, StyleSheet } from 'react-native';
import { SectionTitle, SectionHint } from './Typography';

// A titled block of cards. `animatedStyle` (from usePulse) makes the block pulse
// when the numbers in it are recalculated.
export function Section({ title, hint, animatedStyle, children }) {
  return (
    <Animated.View style={[styles.section, animatedStyle]}>
      {!!title && <SectionTitle>{title}</SectionTitle>}
      {!!hint && <SectionHint>{hint}</SectionHint>}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
  },
});
