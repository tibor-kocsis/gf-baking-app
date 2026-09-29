import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useI18n } from '../context/I18nContext';
import { Header } from '../components/Header';
import { Icon } from '../components/Icon';

export function CookingModeView({ recipe: baseRecipe, ingredients, onBack }) {
  useKeepAwake();
  const { t } = useI18n();
  // A recipe can swap its steps for a variant chosen on the recipe screen.
  const recipe = baseRecipe.variantFor
    ? { ...baseRecipe, ...baseRecipe.variantFor(ingredients) }
    : baseRecipe;
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});

  const instructions = recipe.instructionsKey ? t(recipe.instructionsKey) || [] : [];
  const stepTitles = recipe.stepTitlesKey ? t(recipe.stepTitlesKey) || [] : [];


  const toggleIngredient = (ingredientKey) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [ingredientKey]: !prev[ingredientKey],
    }));
  };

  const toggleStep = (stepIndex) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepIndex]: !prev[stepIndex],
    }));
  };

  const getIngredientAmount = (ingredientKey) => {
    if (!ingredients) return null;
    return ingredients[ingredientKey];
  };

  // Map calculator property names to translation keys where they differ
  const getIngredientTranslationKey = (ingredientKey) => {
    const translationKeyMap = {
      flour: 'gfFlour', // waffle calculator uses 'flour', translation uses 'gfFlour'
    };
    return translationKeyMap[ingredientKey] || ingredientKey;
  };

  // Recipes whose ingredient names are their own (not the shared list) carry them
  // under their own key.
  const getIngredientName = (ingredientKey) =>
    recipe.ingredientNamesKey
      ? t(`${recipe.ingredientNamesKey}.${ingredientKey}`)
      : t(`ingredients.${getIngredientTranslationKey(ingredientKey)}`);

  const getIngredientUnit = (ingredientKey) => {
    const spoon = recipe.ingredientUnits && recipe.ingredientUnits[ingredientKey];
    if (spoon) return ` ${t(spoon === 'tsp' ? 'common.unitTsp' : 'common.unitTbsp')}`;
    // Units based on ingredient type
    // Returns: empty string, 'g', 'ml', or translation key for tsp/tbsp
    const unitMap = {
      egg: '',
      lemonJuice: ` ${t('common.unitTbsp')}`,
      vanilla: ` ${t('common.unitTsp')}`,
      milk: 'ml',
    };
    // Use 'in' check because empty string is falsy but valid
    return ingredientKey in unitMap ? unitMap[ingredientKey] : 'g';
  };

  // Every step in one shape: { title, text, timerSeconds, items: [{ id, name, amount, unit }] }.
  // A screen that builds its own steps (the flour mix) passes them ready-made as
  // `ingredients.cookingPlan`; the recipes are mapped from their step definitions.
  const steps = (ingredients && ingredients.cookingPlan) ||
    (recipe.cookingSteps || []).map((step) => ({
      title: stepTitles[step.instructionIndex],
      text: fillAmounts(instructions[step.instructionIndex], ingredients),
      timerSeconds: step.timerSeconds,
      items: (step.ingredients || []).map((key) => ({
        id: key,
        name: getIngredientName(key),
        amount: getIngredientAmount(key),
        unit: getIngredientUnit(key),
      })),
    }));

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const totalSteps = steps.length;

  const progressText = t('common.stepsCompleted')
    .replace('{completed}', completedCount)
    .replace('{total}', totalSteps);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <StatusBar style="dark" />

        <Header title={t(recipe.nameKey)} onBack={onBack} />

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{progressText}</Text>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: totalSteps > 0 ? `${(completedCount / totalSteps) * 100}%` : '0%' },
              ]}
            />
          </View>
        </View>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => {
            const isCompleted = completedSteps[index];
            const stepIngredients = step.items || [];

            return (
              <View
                key={index}
                style={[styles.stepCard, isCompleted && styles.stepCardCompleted]}
              >
                <TouchableOpacity
                  style={styles.stepHeader}
                  onPress={() => toggleStep(index)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.stepCheckbox, isCompleted && styles.stepCheckboxChecked]}>
                    {isCompleted && (
                      <Icon name="check" size={18} color={colors.onPrimary} strokeWidth={3} />
                    )}
                  </View>
                  <View style={styles.stepNumberContainer}>
                    <Text style={[styles.stepNumber, isCompleted && styles.textCompleted]}>
                      {t('common.step')} {index + 1}
                      {step.title ? ` · ${step.title}` : ''}
                    </Text>
                  </View>
                </TouchableOpacity>

                <Text style={[styles.instructionText, isCompleted && styles.textCompleted]}>
                  {step.text}
                </Text>

                {!!step.timerSeconds && (
                  <View style={styles.durationRow}>
                    <Icon name="timer" size={20} color={colors.primaryOnSoft} strokeWidth={2} />
                    <Text style={styles.durationText}>{formatDuration(step.timerSeconds, t)}</Text>
                  </View>
                )}

                {stepIngredients.length > 0 && (
                  <View style={styles.ingredientsSection}>
                    <Text style={[styles.ingredientsSectionTitle, isCompleted && styles.textCompleted]}>
                      {t('common.ingredientsForStep')}
                    </Text>
                    {stepIngredients.map(({ id, name, amount, unit }) => {
                      const isChecked = checkedIngredients[id];

                      return (
                        <TouchableOpacity
                          key={id}
                          style={styles.ingredientRow}
                          onPress={() => toggleIngredient(id)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.ingredientCheckbox, isChecked && styles.ingredientCheckboxChecked]}>
                            {isChecked && (
                              <Icon name="check" size={16} color={colors.onPrimary} strokeWidth={3} />
                            )}
                          </View>
                          <Text style={[styles.ingredientName, isChecked && styles.ingredientTextChecked]}>
                            {name}
                          </Text>
                          {amount !== null && amount !== undefined && (
                            <Text style={[styles.ingredientAmount, isChecked && styles.ingredientTextChecked]}>
                              {amount}{unit}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

// Steps can quote a scaled amount as {ingredientKey}; the recipe screen and the
// cooking mode fill it from the calculated ingredients.
export function fillAmounts(text, ingredients) {
  if (!ingredients || typeof text !== 'string') return text;
  return text.replace(/\{(\w+)\}/g, (match, key) =>
    ingredients[key] !== undefined ? String(ingredients[key]) : match
  );
}

// Whole minutes, which is how every recipe states its times.
export function formatDuration(seconds, t) {
  return t('common.durationMinutes').split('{minutes}').join(Math.round(seconds / 60));
}

const styles = StyleSheet.create({
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    marginBottom: 14,
  },
  durationText: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.primaryOnSoft,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 40,
  },
  progressContainer: {
    marginBottom: 24,
    gap: 8,
  },
  progressText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  stepsContainer: {
    gap: 14,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  stepCardCompleted: {
    opacity: 0.6,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    marginBottom: 10,
  },
  stepCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepCheckboxChecked: {
    backgroundColor: colors.primary,
  },
  stepNumberContainer: {
    flex: 1,
  },
  stepNumber: {
    fontSize: 14,
    fontFamily: fonts.extrabold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  instructionText: {
    fontSize: 20,
    fontFamily: fonts.medium,
    color: colors.text,
    lineHeight: 29,
    marginBottom: 14,
  },
  textCompleted: {
    color: colors.textSecondary,
  },
  ingredientsSection: {
    gap: 8,
  },
  ingredientsSectionTitle: {
    fontSize: 13,
    fontFamily: fonts.extrabold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 56,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  ingredientCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientCheckboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  ingredientName: {
    flex: 1,
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  ingredientAmount: {
    fontSize: 19,
    fontFamily: fonts.extrabold,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
});
