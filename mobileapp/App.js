import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Animated } from 'react-native';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en';
import hu from './locales/hu';

// ============================================================================
// i18n Setup
// ============================================================================
const translations = { en, hu };
const LANGUAGE_STORAGE_KEY = '@app_language';

const I18nContext = createContext();

function useI18n() {
  return useContext(I18nContext);
}

function I18nProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && translations[savedLanguage]) {
        setLanguage(savedLanguage);
      } else {
        const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
        const detectedLanguage = translations[deviceLocale] ? deviceLocale : 'en';
        setLanguage(detectedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      } catch (error) {
        console.error('Error saving language:', error);
      }
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  if (isLoading) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// ============================================================================
// Color Palette - Earthy/Natural Theme
// ============================================================================
const colors = {
  primary: '#8B7355',
  primaryLight: '#A69076',
  secondary: '#6B8E23',
  background: '#FAF8F5',
  surface: '#FFFFFF',
  text: '#3D3D3D',
  textSecondary: '#6B6B6B',
  accent: '#D4A574',
  border: '#E8E4DF',
};

// ============================================================================
// Recipe Data (with translation keys)
// ============================================================================
const recipes = [
  {
    id: 'pizza',
    type: 'dynamic',
    nameKey: 'recipes.pizza.name',
    icon: '🍕',
    descriptionKey: 'recipes.pizza.description',
    unitLabelKey: 'recipes.pizza.unitLabel',
    howManyKey: 'recipes.pizza.howMany',
    baseWeight: 300,
  },
  {
    id: 'sandwich-bread',
    type: 'static',
    nameKey: 'recipes.sandwichBread.name',
    icon: '🍞',
    descriptionKey: 'recipes.sandwichBread.description',
    ingredients: [
      { nameKey: 'ingredients.sorghumFlour', amount: 170, unit: 'g', emoji: '🌿', category: 'dry' },
      { nameKey: 'ingredients.universalGfFlour', amount: 130, unit: 'g', emoji: '🌱', category: 'dry' },
      { nameKey: 'ingredients.psylliumHusk', amount: 5, unit: 'g', emoji: '🌾', category: 'dry' },
      { nameKey: 'ingredients.activeYeast', amount: 8, unit: 'g', emoji: '🦠', category: 'dry' },
      { nameKey: 'ingredients.salt', amount: 5, unit: 'g', emoji: '🧂', category: 'dry' },
      { nameKey: 'ingredients.oil', amount: 20, unit: 'g', emoji: '🫒', category: 'wet' },
      { nameKey: 'ingredients.honey', amount: 20, unit: 'g', emoji: '🍯', category: 'wet' },
      { nameKey: 'ingredients.egg', amount: 1, unit: '', emoji: '🥚', category: 'wet' },
      { nameKey: 'ingredients.lemonJuice', amount: 1, unit: 'tbsp', emoji: '🍋', category: 'wet' },
      { nameKey: 'ingredients.water', amount: 330, unit: 'g', emoji: '💧', category: 'wet' },
    ],
    instructionsKey: 'instructions.sandwichBread',
  },
  {
    id: 'waffles',
    type: 'dynamic',
    nameKey: 'recipes.waffles.name',
    icon: '🧇',
    descriptionKey: 'recipes.waffles.description',
    unitLabelKey: 'recipes.waffles.unitLabel',
    howManyKey: 'recipes.waffles.howMany',
    instructionsKey: 'instructions.waffles',
  },
];

// Pizza calculation logic
function calculatePizzaIngredients(count) {
  const numPizzas = parseInt(count) || 0;
  if (numPizzas <= 0) return null;

  const flourPerPizza = 300 / 1.945;
  const flourRounded = Math.round(flourPerPizza / 25) * 25;
  const totalFlour = flourRounded * numPizzas;

  const sorghumFlour = Math.round(totalFlour * 0.6);
  const glutenFreeFlour = Math.round(totalFlour * 0.4);
  const water = Math.round(flourRounded * 0.8 * numPizzas);
  const salt = Math.round(flourRounded * 0.03 * numPizzas);
  const yeast = Math.round(flourRounded * 0.015 * numPizzas);
  const oil = Math.round(flourRounded * 0.05 * numPizzas);
  const honey = Math.round(flourRounded * 0.05 * numPizzas);

  const totalWeight = sorghumFlour + glutenFreeFlour + water + salt + yeast + oil + honey;
  const weightPerPizza = Math.round(totalWeight / numPizzas);

  return {
    sorghumFlour,
    glutenFreeFlour,
    water,
    salt,
    yeast,
    oil,
    honey,
    totalWeight,
    weightPerPizza,
    numPizzas,
  };
}

// Waffle calculation logic
function calculateWaffleIngredients(multiplier) {
  const mult = parseInt(multiplier) || 0;
  if (mult <= 0) return null;

  // Base recipe (1x)
  const egg = mult;
  const milk = 100 * mult;
  const flour = 100 * mult;
  const butter = 25 * mult;
  const vanilla = mult;
  const sugar = 15 * mult;
  const bakingPowder = Math.round(2.5 * mult * 10) / 10;

  return {
    egg,
    milk,
    flour,
    butter,
    vanilla,
    sugar,
    bakingPowder,
    multiplier: mult,
  };
}

// ============================================================================
// Main App Component
// ============================================================================
export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

function AppContent() {
  const [screen, setScreen] = useState({ type: 'catalog' });

  const navigateToRecipe = (recipeId) => {
    setScreen({ type: 'recipe', recipeId });
  };

  const navigateToCatalog = () => {
    setScreen({ type: 'catalog' });
  };

  if (screen.type === 'catalog') {
    return <RecipeCatalog onSelectRecipe={navigateToRecipe} />;
  }

  const recipe = recipes.find(r => r.id === screen.recipeId);
  if (!recipe) {
    return <RecipeCatalog onSelectRecipe={navigateToRecipe} />;
  }

  if (recipe.type === 'dynamic') {
    return <DynamicRecipeView recipe={recipe} onBack={navigateToCatalog} />;
  }

  return <StaticRecipeView recipe={recipe} onBack={navigateToCatalog} />;
}

// ============================================================================
// Language Selector Component
// ============================================================================
function LanguageSelector() {
  const { language, changeLanguage } = useI18n();

  return (
    <View style={styles.languageSelector}>
      <TouchableOpacity
        style={[
          styles.languageButton,
          language === 'en' && styles.languageButtonActive
        ]}
        onPress={() => changeLanguage('en')}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.languageButtonText,
          language === 'en' && styles.languageButtonTextActive
        ]}>EN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.languageButton,
          language === 'hu' && styles.languageButtonActive
        ]}
        onPress={() => changeLanguage('hu')}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.languageButtonText,
          language === 'hu' && styles.languageButtonTextActive
        ]}>HU</Text>
      </TouchableOpacity>
    </View>
  );
}

// ============================================================================
// Recipe Catalog Screen
// ============================================================================
function RecipeCatalog({ onSelectRecipe }) {
  const { t } = useI18n();

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <StatusBar style="dark" />

        <View style={styles.catalogHeader}>
          <Text style={styles.appTitle}>{t('app.title')}</Text>
          <Text style={styles.appSubtitle}>{t('app.subtitle')}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('common.recipes')}</Text>

        <View style={styles.recipeList}>
          {recipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => onSelectRecipe(recipe.id)}
              activeOpacity={0.7}
            >
              <View style={styles.recipeCardContent}>
                <Text style={styles.recipeIcon}>{recipe.icon}</Text>
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeName}>{t(recipe.nameKey)}</Text>
                  <Text style={styles.recipeDescription}>{t(recipe.descriptionKey)}</Text>
                </View>
                <View style={[
                  styles.typeBadge,
                  recipe.type === 'dynamic' ? styles.typeBadgeDynamic : styles.typeBadgeStatic
                ]}>
                  <Text style={styles.typeBadgeText}>
                    {recipe.type === 'dynamic' ? t('common.calculator') : t('common.recipe')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <LanguageSelector />
      </View>
    </ScrollView>
  );
}

// ============================================================================
// Dynamic Recipe View (Calculator)
// ============================================================================
function DynamicRecipeView({ recipe, onBack }) {
  const { t } = useI18n();
  const [count, setCount] = useState('1');
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
    setCount(String(current + 1));
  };

  const handleDecrement = () => {
    const current = parseInt(count) || 0;
    if (current > 1) {
      setCount(String(current - 1));
    }
  };

  // Calculate ingredients based on recipe type
  const isPizza = recipe.id === 'pizza';
  const isWaffle = recipe.id === 'waffles';
  const ingredients = isPizza
    ? calculatePizzaIngredients(count)
    : isWaffle
    ? calculateWaffleIngredients(count)
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
      </View>
    </ScrollView>
  );
}

// ============================================================================
// Static Recipe View
// ============================================================================
function StaticRecipeView({ recipe, onBack }) {
  const { t } = useI18n();
  const dryIngredients = recipe.ingredients.filter(i => i.category === 'dry');
  const wetIngredients = recipe.ingredients.filter(i => i.category === 'wet');
  const instructions = t(recipe.instructionsKey);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <StatusBar style="dark" />

        <Header title={t(recipe.nameKey)} onBack={onBack} />

        <View style={styles.recipeHeader}>
          <Text style={styles.recipeHeaderIcon}>{recipe.icon}</Text>
          <Text style={styles.recipeHeaderSubtitle}>{t('common.glutenFreeRecipe')}</Text>
        </View>

        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>{t('common.ingredients')}</Text>

          <View style={styles.ingredientCard}>
            <Text style={styles.categoryTitle}>{t('common.dryIngredients')}</Text>
            {dryIngredients.map((ingredient, index) => (
              <IngredientRow
                key={index}
                name={t(ingredient.nameKey)}
                amount={ingredient.amount}
                unit={ingredient.unit}
                emoji={ingredient.emoji}
              />
            ))}
          </View>

          <View style={styles.ingredientCard}>
            <Text style={styles.categoryTitle}>{t('common.wetIngredients')}</Text>
            {wetIngredients.map((ingredient, index) => (
              <IngredientRow
                key={index}
                name={t(ingredient.nameKey)}
                amount={ingredient.amount}
                unit={ingredient.unit}
                emoji={ingredient.emoji}
              />
            ))}
          </View>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>{t('common.instructions')}</Text>
          <View style={styles.instructionCard}>
            {instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionRow}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// ============================================================================
// Shared Components
// ============================================================================
function Header({ title, onBack }) {
  return (
    <View style={styles.headerBar}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

function IngredientRow({ name, amount, unit, emoji }) {
  return (
    <View style={styles.ingredientRow}>
      <View style={styles.ingredientLeft}>
        <Text style={styles.ingredientEmoji}>{emoji}</Text>
        <Text style={styles.ingredientName}>{name}</Text>
      </View>
      <Text style={styles.ingredientAmount}>
        {amount}{unit}
      </Text>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================
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

  // Language Selector
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  languageButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  languageButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  languageButtonTextActive: {
    color: '#fff',
  },

  // Catalog Header
  catalogHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },

  // Recipe List
  recipeList: {
    gap: 16,
  },
  recipeCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  recipeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeBadgeDynamic: {
    backgroundColor: colors.secondary + '20',
  },
  typeBadgeStatic: {
    backgroundColor: colors.accent + '30',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },

  // Header Bar
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },

  // Recipe Header
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

  // Input Section
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

  // Summary Box
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

  // Ingredients
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
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ingredientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ingredientEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  ingredientName: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  ingredientAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },

  // Instructions
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
