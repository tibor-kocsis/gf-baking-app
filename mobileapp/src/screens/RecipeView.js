import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useI18n } from '../context/I18nContext';
import { useSessionState } from '../hooks/useSessionState';
import { usePulse } from '../hooks/usePulse';
import { formatUnit } from '../utils/format';
import {
  defaultOptions,
  optionCardsFor,
  resolveRecipe,
  ingredientGroupsFor,
  instructionsFor,
  recipeNotesFor,
} from '../utils/recipeModel';
import { buildRecipePlan } from '../utils/cookingPlan';
import { RecipeScreenLayout } from '../components/RecipeScreenLayout';
import { Stepper } from '../components/Stepper';
import { Card } from '../components/Card';
import { SwitchRow } from '../components/SwitchRow';
import { SegmentedControl } from '../components/SegmentedControl';
import { ChoiceGrid } from '../components/ChoiceGrid';
import { Hint } from '../components/Typography';
import { SummaryCard } from '../components/SummaryCard';
import { Section } from '../components/Section';
import { IngredientCard } from '../components/IngredientCard';
import { InstructionList } from '../components/InstructionList';
import { BulletList } from '../components/BulletList';

// Any scaled recipe from the catalog: everything it shows is declared on the
// recipe (see data/recipes.js), so this screen knows no recipe by name.
export function RecipeView({ recipe, onBack, onStartCooking }) {
  const { t } = useI18n();
  const [settings, setSettings] = useSessionState(`recipe:${recipe.id}`, () => ({
    count: String(recipe.initialValue || 1),
    options: defaultOptions(recipe),
  }));
  const { count, options } = settings;

  const ingredients = useMemo(() => recipe.calculate(count, options), [recipe, count, options]);
  const activeRecipe = useMemo(() => resolveRecipe(recipe, options), [recipe, options]);
  const pulse = usePulse(ingredients);

  const setCount = (value) => setSettings((current) => ({ ...current, count: value }));
  const setOption = (key, value) =>
    setSettings((current) => ({ ...current, options: { ...current.options, [key]: value } }));

  const canCook = !!ingredients && !!activeRecipe.instructionsKey && !!activeRecipe.cookingSteps;
  const handleStartCooking = () => onStartCooking(buildRecipePlan(activeRecipe, ingredients, t));

  return (
    <RecipeScreenLayout recipe={recipe} onBack={onBack} onStartCooking={canCook ? handleStartCooking : null}>
      <Stepper
        label={t(recipe.howManyKey)}
        value={count}
        onChange={setCount}
        step={recipe.stepSize || 1}
        suffix={recipe.unitLabelKey ? t(recipe.unitLabelKey) : null}
      />

      {optionCardsFor(recipe, options).map((rows) => (
        <Card key={rows[0].key}>
          {rows.map((row, index) =>
            row.type === 'choice' ? (
              <OptionChoice key={row.key} row={row} value={options[row.key]} onChange={setOption} />
            ) : (
              <SwitchRow
                key={row.key}
                label={t(row.labelKey)}
                hint={t(row.hintKey)}
                value={options[row.key]}
                onValueChange={(value) => setOption(row.key, value)}
                divider={index < rows.length - 1}
              />
            )
          )}
        </Card>
      ))}

      {!!ingredients && <RecipeResults recipe={activeRecipe} ingredients={ingredients} pulse={pulse} />}
    </RecipeScreenLayout>
  );
}

// One choice of a recipe option, e.g. pizza dough 2's flours.
function OptionChoice({ row, value, onChange }) {
  const { t } = useI18n();
  const options = row.choices.map((item) => ({ key: item.key, label: item.label || t(item.labelKey) }));
  return (
    <View style={styles.choice}>
      <Text style={styles.choiceLabel}>{t(row.labelKey)}</Text>
      {row.multiple ? (
        <ChoiceGrid options={options} value={value} multiple onChange={(next) => onChange(row.key, next)} />
      ) : (
        <SegmentedControl options={options} value={value} onChange={(key) => onChange(row.key, key)} />
      )}
      {!!row.hintKey && <Hint>{t(row.hintKey)}</Hint>}
    </View>
  );
}

function RecipeResults({ recipe, ingredients, pulse }) {
  const { t } = useI18n();
  const instructions = instructionsFor(recipe, ingredients, t);
  const notes = recipeNotesFor(recipe, t);

  return (
    <>
      {!!recipe.summary && (
        <SummaryCard
          animatedStyle={pulse}
          items={recipe.summary.map((item) => ({ label: t(item.labelKey), value: `${ingredients[item.key]}${item.unit || 'g'}` }))}
        />
      )}

      <Section
        title={t('common.requiredIngredients')}
        hint={recipe.metaKey ? t(recipe.metaKey) : null}
        animatedStyle={pulse}
      >
        {ingredientGroupsFor(recipe, ingredients).map((group) => (
          <IngredientCard
            key={group.key}
            title={t(group.titleKey)}
            rows={group.items.map((item) => ({
              key: item.key,
              name: t(item.nameKey),
              amount: item.amount,
              unit: formatUnit(item.unit, t),
            }))}
          />
        ))}
      </Section>

      {instructions.length > 0 && (
        <Section title={t('common.instructions')}>
          <InstructionList steps={instructions} />
        </Section>
      )}

      {notes.length > 0 && (
        <Section title={t('common.recipeNotes')}>
          <BulletList items={notes} />
        </Section>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  choice: {
    marginTop: 8,
    marginBottom: 8,
    gap: 10,
  },
  choiceLabel: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textSecondary,
  },
});
