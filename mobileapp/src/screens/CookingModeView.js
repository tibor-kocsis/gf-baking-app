import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { useI18n } from '../context/I18nContext';
import { Header } from '../components/Header';

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
                    {isCompleted && <Text style={styles.checkmark}>✓</Text>}
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
                  <Text style={[styles.durationText, isCompleted && styles.textCompleted]}>
                    ⏱ {formatDuration(step.timerSeconds, t)}
                  </Text>
                )}

                {stepIngredients.length > 0 && (
                  <View style={styles.ingredientsSection}>
                    <Text style={[styles.ingredientsSectionTitle, isCompleted && styles.textCompleted]}>
                      {t('common.ingredientsForStep')}:
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
                            {isChecked && <Text style={styles.ingredientCheckmark}>✓</Text>}
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
  durationText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  stepsContainer: {
    gap: 16,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  stepCardCompleted: {
    opacity: 0.7,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepCheckboxChecked: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepNumberContainer: {
    flex: 1,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  instructionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  textCompleted: {
    color: colors.textSecondary,
  },
  ingredientsSection: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  ingredientsSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ingredientCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  ingredientCheckboxChecked: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  ingredientCheckmark: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  ingredientName: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  ingredientAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
});
