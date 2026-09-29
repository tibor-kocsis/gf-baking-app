import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { useI18n } from '../../context/I18nContext';
import { bandText, capHintsFor, ingredientName } from '../../utils/flourMixPresentation';
import { Section } from '../Section';
import { Card } from '../Card';
import { CategoryTitle, Hint } from '../Typography';
import { MeterBar, SplitBar } from '../Meter';

// How the blend divides: flour against starch, what is inside each, and where
// the psyllium comes from. Caps the solver held or relaxed are marked.
export function BreakdownSection({ formula, animatedStyle }) {
  const { t } = useI18n();
  const capHints = capHintsFor(formula, t);

  return (
    <Section title={t('flourMix.breakdownTitle')} animatedStyle={animatedStyle}>
      <Card>
        <CategoryTitle>{t('flourMix.ratioTitle')}</CategoryTitle>
        <SplitBar
          segments={[
            { key: 'flour', value: Math.max(formula.flourPercent, 1), color: colors.primary },
            { key: 'starch', value: formula.starchPercent, color: colors.chartSecondary },
          ]}
        />
        <View style={styles.splitLabels}>
          <View>
            <Text style={styles.splitPercent}>{t('flourMix.flourPercentLabel', { percent: formula.flourPercent })}</Text>
            <Text style={styles.splitGrams}>{formula.flourTotal} g</Text>
          </View>
          <View style={styles.splitRight}>
            <Text style={styles.splitPercent}>{t('flourMix.starchPercentLabel', { percent: formula.starchPercent })}</Text>
            <Text style={styles.splitGrams}>{formula.starchTotal} g</Text>
          </View>
        </View>
        <Hint>{bandText(formula, t)}</Hint>
      </Card>

      <FractionCard title={t('flourMix.insideFlour')} rows={formula.flourBreakdown} capHints={capHints} />
      <FractionCard title={t('flourMix.insideStarch')} rows={formula.starchBreakdown} capHints={capHints} />

      <Card>
        <CategoryTitle>{t('flourMix.psylliumTitle')}</CategoryTitle>
        <View style={styles.psylliumRow}>
          <Text style={styles.psylliumTotal}>{t('flourMix.psylliumTotalLabel', { amount: formula.psyllium.total })}</Text>
          <Text style={styles.psylliumPercent}>{t('flourMix.psylliumOfBase', { percent: formula.psyllium.percent })}</Text>
        </View>
        <SplitBar
          segments={[
            { key: 'fromMix', value: formula.psyllium.fromMix, color: colors.primary },
            { key: 'added', value: formula.psyllium.added, color: colors.chartSecondary },
          ]}
        />
        <View style={styles.splitLabels}>
          <Text style={styles.splitGrams}>{t('flourMix.psylliumFromMix', { amount: formula.psyllium.fromMix })}</Text>
          <Text style={styles.splitGrams}>{t('flourMix.psylliumAdded', { amount: formula.psyllium.added })}</Text>
        </View>
      </Card>
    </Section>
  );
}

// One fraction's parts, each with its share bar and any cap annotation.
function FractionCard({ title, rows, capHints }) {
  const { t } = useI18n();
  if (rows.length === 0) return null;

  return (
    <Card>
      <CategoryTitle>{title}</CategoryTitle>
      {rows.map((row, index) => {
        const cap = capHints[row.key];
        return (
          <View key={row.key} style={[styles.fraction, index === rows.length - 1 && styles.fractionLast]}>
            <View style={styles.fractionHeader}>
              <Text style={styles.fractionName}>
                {ingredientName(row.key, t)}
                {row.fromMix > 0 ? ` · ${t('flourMix.fromMix')}` : ''}
              </Text>
              <View style={styles.fractionValues}>
                <Text style={styles.fractionAmount}>{row.amount} g</Text>
                <Text style={styles.fractionPercent}>{Math.round(row.percent)}%</Text>
              </View>
            </View>
            <MeterBar percent={row.percent} color={cap && cap.over ? colors.warning : colors.primary} />
            {!!cap && <Text style={[styles.capHint, cap.over && styles.capHintOver]}>{cap.hint}</Text>}
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  splitLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  splitRight: {
    alignItems: 'flex-end',
  },
  splitPercent: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  splitGrams: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  psylliumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  psylliumTotal: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  psylliumPercent: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  fraction: {
    gap: 6,
    marginBottom: 16,
  },
  fractionLast: {
    marginBottom: 0,
  },
  fractionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
  },
  fractionName: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  fractionValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  fractionAmount: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  fractionPercent: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  capHint: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  capHintOver: {
    fontFamily: fonts.semibold,
    color: colors.warningText,
  },
});
