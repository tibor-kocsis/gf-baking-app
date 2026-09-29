import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

const clampPercent = (percent) => `${Math.max(0, Math.min(100, percent))}%`;

// A share of a whole, 0-100. The fill width is data, so it is the one style
// computed at render time.
export function MeterBar({ percent, color = colors.primary }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: clampPercent(percent), backgroundColor: color }]} />
    </View>
  );
}

// Two or more parts of one whole side by side: [{ key, value, color }].
export function SplitBar({ segments }) {
  return (
    <View style={styles.splitTrack}>
      {segments.map((segment) => (
        <View
          key={segment.key}
          // A zero share still needs a positive flex, or the other part fills the bar.
          style={[styles.splitSegment, { flex: Math.max(segment.value, 0.0001), backgroundColor: segment.color }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
  splitTrack: {
    flexDirection: 'row',
    gap: 2,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  splitSegment: {
    height: 12,
  },
});
