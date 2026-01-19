import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { useI18n } from '../context/I18nContext';
import { Header } from '../components/Header';

export function CookingModeView({ recipe, ingredients, onBack }) {
  const { t } = useI18n();
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});

  const cookingSteps = recipe.cookingSteps || [];
  const instructions = t(recipe.instructionsKey) || [];

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const totalSteps = cookingSteps.length;

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

  const getIngredientUnit = (ingredientKey) => {
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
          {cookingSteps.map((step, index) => {
            const isCompleted = completedSteps[index];
            const instruction = instructions[step.instructionIndex];
            const stepIngredients = step.ingredients || [];

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
                    </Text>
                  </View>
                </TouchableOpacity>

                <Text style={[styles.instructionText, isCompleted && styles.textCompleted]}>
                  {instruction}
                </Text>

                {stepIngredients.length > 0 && (
                  <View style={styles.ingredientsSection}>
                    <Text style={[styles.ingredientsSectionTitle, isCompleted && styles.textCompleted]}>
                      {t('common.ingredientsForStep')}:
                    </Text>
                    {stepIngredients.map((ingredientKey) => {
                      const isChecked = checkedIngredients[ingredientKey];
                      const amount = getIngredientAmount(ingredientKey);
                      const unit = getIngredientUnit(ingredientKey);

                      return (
                        <TouchableOpacity
                          key={ingredientKey}
                          style={styles.ingredientRow}
                          onPress={() => toggleIngredient(ingredientKey)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.ingredientCheckbox, isChecked && styles.ingredientCheckboxChecked]}>
                            {isChecked && <Text style={styles.ingredientCheckmark}>✓</Text>}
                          </View>
                          <Text style={[styles.ingredientName, isChecked && styles.ingredientTextChecked]}>
                            {t(`ingredients.${getIngredientTranslationKey(ingredientKey)}`)}
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

const styles = StyleSheet.create({
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
