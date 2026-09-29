import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { Card } from './Card';

// Recipe notes and solver notes: a card of short paragraphs, each with a dot.
export function BulletList({ items }) {
  return (
    <Card>
      {items.map((item, index) => (
        <View key={index} style={[styles.row, index === items.length - 1 && styles.rowLast]}>
          <View style={styles.dot} />
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  rowLast: {
    marginBottom: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  text: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text,
    lineHeight: 22,
  },
});
