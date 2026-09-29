import { useI18n } from '../../context/I18nContext';
import { formatUnit } from '../../utils/format';
import { formulaGroups, ingredientName } from '../../utils/flourMixPresentation';
import { Section } from '../Section';
import { IngredientCard } from '../IngredientCard';
import { Hint } from '../Typography';

// What to weigh, by group, with each line's baker's percentage.
export function FormulaSection({ formula, animatedStyle }) {
  const { t } = useI18n();

  return (
    <Section
      title={t('flourMix.percentTitle')}
      hint={t('flourMix.percentHint', { base: formula.base })}
      animatedStyle={animatedStyle}
    >
      {formulaGroups(formula).map((group) => (
        <IngredientCard
          key={group.key}
          title={t(`flourMix.groups.${group.key}`)}
          rows={group.rows.map((row) => ({
            key: row.key,
            name: ingredientName(row.key, t),
            percent: row.percent,
            amount: row.amount,
            unit: formatUnit(row.unit || 'g', t),
          }))}
        >
          {group.key === 'liquid' && formula.water.egg > 0 && (
            <Hint>{t('flourMix.eggHint', { amount: formula.water.egg })}</Hint>
          )}
          {group.key === 'addition' && <Hint>{t('flourMix.dryYeastHint', { amount: formula.dryYeast })}</Hint>}
        </IngredientCard>
      ))}
    </Section>
  );
}
