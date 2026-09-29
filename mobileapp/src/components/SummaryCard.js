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
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        </Fragment>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inverse,
    borderRadius: layout.cardRadius,
    padding: 22,
    marginBottom: 24,
  },
  item: {
    flex: 1,
    gap: 2,
  },
  divider: {
    width: 1,
    height: 48,
    marginHorizontal: 16,
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
});
