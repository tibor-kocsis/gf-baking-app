import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { Card } from './Card';
import { DurationBadge } from './DurationBadge';

// The numbered method: [{ title, text, timerSeconds }].
export function InstructionList({ steps }) {
  return (
    <Card style={styles.list}>
      {steps.map((step, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.number}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <View style={styles.body}>
            {!!step.title && <Text style={styles.title}>{step.title}</Text>}
            <Text style={styles.text}>{step.text}</Text>
            {!!step.timerSeconds && <DurationBadge seconds={step.timerSeconds} />}
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  number: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.primaryOnSoft,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
    lineHeight: 24,
  },
});
