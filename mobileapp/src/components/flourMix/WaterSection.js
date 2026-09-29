import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { useI18n } from '../../context/I18nContext';
import { formatUnit } from '../../utils/format';
import { ingredientName } from '../../utils/flourMixPresentation';
import { Section } from '../Section';
import { Card } from '../Card';
import { Hint } from '../Typography';
import { IngredientRow } from '../IngredientRow';

// The total hydration and the streams it is poured in. For the enriched bun the
// liquid is milk, weighed in grams.
export function WaterSection({ formula, animatedStyle }) {
  const { t } = useI18n();
  const { water } = formula;
  const milk = water.liquid === 'milk';
  const liquidUnit = milk ? 'g' : 'ml';

  const streams = [];
  if (water.tangzhong > 0) {
    streams.push({
      key: 'tangzhong',
      name: t('flourMix.streamTangzhong'),
      hint: t(milk ? 'flourMix.streamTangzhongMilkHint' : 'flourMix.streamTangzhongHint', {
        amount: formula.tangzhong.flourTotal,
        ingredient: ingredientName(formula.tangzhong.flour[0].key, t),
      }),
      amount: water.tangzhong,
      unit: liquidUnit,
    });
  }
  if (water.egg > 0) {
    streams.push({
      key: 'egg',
      name: t('flourMix.streamEgg'),
      hint: t('flourMix.streamEggHint'),
      amount: water.eggCount,
      unit: formatUnit('pcs', t),
    });
  }
  if (water.psylliumGel > 0) {
    streams.push({
      key: 'gel',
      name: t('flourMix.streamGel'),
      hint: t('flourMix.streamGelHint', { ratio: water.gelRatio, amount: formula.psyllium.added }),
      amount: water.psylliumGel,
      unit: 'ml',
    });
  }
  streams.push({
    key: 'remainder',
    name: t(milk ? 'flourMix.streamRemainderMilk' : 'flourMix.streamRemainder'),
    hint: t('flourMix.streamRemainderHint'),
    amount: water.remainder,
    unit: liquidUnit,
  });

  return (
    <Section title={t('flourMix.waterTitle')} animatedStyle={animatedStyle}>
      <Card>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t('flourMix.waterTotal')}</Text>
          <View style={styles.totalValues}>
            <Text style={styles.totalPercent}>{Math.round(formula.hydration)}%</Text>
            <Text style={styles.totalValue}>{water.total}ml</Text>
          </View>
        </View>
        {milk && <Hint>{t('flourMix.waterEquivalentHint')}</Hint>}
        {streams.map(({ key, ...stream }, index) => (
          <IngredientRow key={key} {...stream} last={index === streams.length - 1} />
        ))}
      </Card>
    </Section>
  );
}

const styles = StyleSheet.create({
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  totalValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  totalPercent: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  totalValue: {
    fontSize: 22,
    fontFamily: fonts.display,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
});
