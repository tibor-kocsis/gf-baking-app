import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { useI18n } from '../context/I18nContext';
import { calculatePizzaIngredients, calculateWaffleIngredients, calculateSandwichBreadIngredients } from '../utils/recipeCalculators';
import { Header } from '../components/Header';
import { IngredientRow } from '../components/IngredientRow';

export function DynamicRecipeView({ recipe, onBack }) {
  const { t } = useI18n();

  // Determine initial value and step size based on recipe type
  const isSandwichBread = recipe.id === 'sandwich-bread';
  const initialValue = isSandwichBread ? String(recipe.defaultFlour || 300) : '1';
  const stepSize = recipe.stepSize || 1;
  const minValue = isSandwichBread ? stepSize : 1;

  const [count, setCount] = useState(initialValue);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [count]);

  const handleIncrement = () => {
    const current = parseInt(count) || 0;
    setCount(String(current + stepSize));
  };

  const handleDecrement = () => {
    const current = parseInt(count) || 0;
    if (current > minValue) {
      setCount(String(current - stepSize));
    }
  };

  // Calculate ingredients based on recipe type
  const isPizza = recipe.id === 'pizza';
  const isWaffle = recipe.id === 'waffles';
  const ingredients = isPizza
    ? calculatePizzaIngredients(count)
    : isWaffle
    ? calculateWaffleIngredients(count)
    : isSandwichBread
    ? calculateSandwichBreadIngredients(count)
    : null;

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <StatusBar style="dark" />

        <Header title={t(recipe.nameKey)} onBack={onBack} />

        <View style={styles.recipeHeader}>
          <Text style={styles.recipeHeaderIcon}>{recipe.icon}</Text>
          <Text style={styles.recipeHeaderSubtitle}>{t('common.glutenFreeRecipe')}</Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>{t(recipe.howManyKey)}</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleDecrement}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>−</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={count}
              onChangeText={setCount}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleIncrement}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pizza-specific summary */}
        {isPizza && ingredients && (
          <Animated.View
            style={[
              styles.summaryBox,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>{t('common.totalDough')}</Text>
                <Text style={styles.summaryValue}>{ingredients.totalWeight}g</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>{t('common.perPizza')}</Text>
                <Text style={styles.summaryValue}>{ingredients.weightPerPizza}g</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Pizza ingredients */}
        {isPizza && ingredients && (
          <Animated.View
            style={[
              styles.ingredientsContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>{t('common.requiredIngredients')}</Text>

            <View style={styles.ingredientCard}>
              <Text style={styles.categoryTitle}>{t('common.flour')}</Text>
              <IngredientRow
                name={t('ingredients.sorghumFlour')}
                amount={ingredients.sorghumFlour}
                unit="g"
                emoji="🌿"
              />
              <IngredientRow
                name={t('ingredients.universalGfFlour')}
                amount={ingredients.glutenFreeFlour}
                unit="g"
                emoji="🌱"
              />
            </View>

            <View style={styles.ingredientCard}>
              <Text style={styles.categoryTitle}>{t('common.wetIngredients')}</Text>
              <IngredientRow
                name={t('ingredients.water')}
                amount={ingredients.water}
                unit="g"
                emoji="💧"
              />
              <IngredientRow
                name={t('ingredients.oil')}
                amount={ingredients.oil}
                unit="g"
                emoji="🫒"
              />
              <IngredientRow
                name={t('ingredients.honey')}
                amount={ingredients.honey}
                unit="g"
                emoji="🍯"
              />
            </View>

            <View style={styles.ingredientCard}>
              <Text style={styles.categoryTitle}>{t('common.dryIngredients')}</Text>
              <IngredientRow
                name={t('ingredients.salt')}
                amount={ingredients.salt}
                unit="g"
                emoji="🧂"
              />
              <IngredientRow
                name={t('ingredients.yeast')}
                amount={ingredients.yeast}
                unit="g"
                emoji="🦠"
              />
            </View>
          </Animated.View>
        )}

        {/* Waffle ingredients */}
        {isWaffle && ingredients && (
          <Animated.View
            style={[
              styles.ingredientsContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>{t('common.requiredIngredients')}</Text>

            <View style={styles.ingredientCard}>
              <Text style={styles.categoryTitle}>{t('common.dryIngredients')}</Text>
              <IngredientRow
                name={t('ingredients.gfFlour')}
                amount={ingredients.flour}
                unit="g"
                emoji="🌾"
              />
              <IngredientRow
                name={t('ingredients.sugar')}
                amount={ingredients.sugar}
                unit="g"
                emoji="🍬"
              />
              <IngredientRow
                name={t('ingredients.bakingPowder')}
                amount={ingredients.bakingPowder}
                unit="g"
                emoji="🧂"
              />
            </View>

            <View style={styles.ingredientCard}>
              <Text style={styles.categoryTitle}>{t('common.wetIngredients')}</Text>
              <IngredientRow
                name={t('ingredients.egg')}
                amount={ingredients.egg}
                unit=""
                emoji="🥚"
              />
              <IngredientRow
                name={t('ingredients.milk')}
                amount={ingredients.milk}
                unit="ml"
                emoji="🥛"
              />
              <IngredientRow
                name={t('ingredients.butter')}
                amount={ingredients.butter}
                unit="g"
                emoji="🧈"
              />
              <IngredientRow
                name={t('ingredients.vanilla')}
                amount={ingredients.vanilla}
                unit=" tsp"
                emoji="🌿"
              />
            </View>
          </Animated.View>
        )}

        {/* Waffle instructions */}
        {isWaffle && ingredients && recipe.instructionsKey && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.sectionTitle}>{t('common.instructions')}</Text>
            <View style={styles.instructionCard}>
              {t(recipe.instructionsKey).map((instruction, index) => (
                <View key={index} style={styles.instructionRow}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Sandwich bread ingredients */}
        {isSandwichBread && ingredients && (
          <Animated.View
            style={[
              styles.ingredientsContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>{t('common.requiredIngredients')}</Text>

            <View style={styles.ingredientCard}>
              <Text style={styles.categoryTitle}>{t('common.flour')}</Text>
              <IngredientRow
                name={t('ingredients.sorghumFlour')}
                amount={ingredients.sorghumFlour}
                unit="g"
                emoji="🌿"
              />
              <IngredientRow
                name={t('ingredients.universalGfFlour')}
                amount={ingredients.universalGfFlour}
                unit="g"
                emoji="🌱"
              />
            </View>

            <View style={styles.ingredientCard}>
              <Text style={styles.categoryTitle}>{t('common.dryIngredients')}</Text>
              <IngredientRow
                name={t('ingredients.psylliumHusk')}
                amount={ingredients.psylliumHusk}
                unit="g"
                emoji="🌾"
              />
              <IngredientRow
                name={t('ingredients.activeYeast')}
                amount={ingredients.activeYeast}
                unit="g"
                emoji="🦠"
              />
              <IngredientRow
                name={t('ingredients.salt')}
                amount={ingredients.salt}
                unit="g"
                emoji="🧂"
              />
            </View>

            <View style={styles.ingredientCard}>
              <Text style={styles.categoryTitle}>{t('common.wetIngredients')}</Text>
              <IngredientRow
                name={t('ingredients.water')}
                amount={ingredients.water}
                unit="g"
                emoji="💧"
              />
              <IngredientRow
                name={t('ingredients.oil')}
                amount={ingredients.oil}
                unit="g"
                emoji="🫒"
              />
              <IngredientRow
                name={t('ingredients.honey')}
                amount={ingredients.honey}
                unit="g"
                emoji="🍯"
              />
              <IngredientRow
                name={t('ingredients.egg')}
                amount={ingredients.egg}
                unit=""
                emoji="🥚"
              />
              <IngredientRow
                name={t('ingredients.lemonJuice')}
                amount={ingredients.lemonJuice}
                unit=" tbsp"
                emoji="🍋"
              />
            </View>
          </Animated.View>
        )}

        {/* Sandwich bread instructions */}
        {isSandwichBread && ingredients && recipe.instructionsKey && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.sectionTitle}>{t('common.instructions')}</Text>
            <View style={styles.instructionCard}>
              {t(recipe.instructionsKey).map((instruction, index) => (
                <View key={index} style={styles.instructionRow}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
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
  recipeHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  recipeHeaderIcon: {
    fontSize: 80,
    marginBottom: 8,
  },
  recipeHeaderSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    width: 100,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  summaryBox: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 2,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  ingredientsContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  ingredientCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  instructionsContainer: {
    marginTop: 8,
  },
  instructionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
});
