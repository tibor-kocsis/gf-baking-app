import { Fragment } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { layout } from '../constants/layout';

// The dark card with the headline numbers: [{ label, value }], side by side.
export function SummaryCard({ items, animatedStyle }) {
  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 && <View style={styles.divider} />}
          <View style={styles.item}>
            <Text style={styles.label} numberOfLines={2}>{item.label}</Text>
            <Text style={[styles.value, items.length > 2 && styles.valueCompact]} numberOfLines={1} adjustsFontSizeToFit>
              {item.value}
            </Text>
          </View>
        </Fragment>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.inverse,
    borderRadius: layout.cardRadius,
    padding: 22,
    marginBottom: 24,
  },
  // Values share a baseline even when a label wraps to two lines.
  item: {
    flex: 1,
    gap: 2,
    justifyContent: 'flex-end',
  },
  divider: {
    width: 1,
    marginHorizontal: 12,
    backgroundColor: colors.textSecondary,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.onInverseSecondary,
  },
  value: {
    fontSize: 34,
    fontFamily: fonts.display,
    color: colors.onInverse,
    fontVariant: ['tabular-nums'],
  },
  // Three boxes side by side: a smaller number keeps "1160 g" on one line.
  valueCompact: {
    fontSize: 26,
  },
});
