import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
  StyleSheet,
} from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useI18n } from '../context/I18nContext';
import {
  calculatePizzaIngredients,
  calculateWaffleIngredients,
  calculatePancakeIngredients,
  calculateCheeseStickIngredients,
  calculatePizza2Ingredients,
  calculatePizza3Ingredients,
} from '../utils/recipeCalculators';
import { Header } from '../components/Header';
import { Icon } from '../components/Icon';
import { RecipeHero } from '../components/RecipeHero';
import { Stepper } from '../components/Stepper';
import { StartCookingBar } from '../components/StartCookingBar';
import { IngredientRow } from '../components/IngredientRow';
import { NotesList } from '../components/NotesList';
import { NoteEditor } from '../components/NoteEditor';
import { PhotoPreview } from '../components/PhotoPreview';
import { formatDuration, fillAmounts } from './CookingModeView';

// The cheese stick recipe's own ingredient groups, in the order it lists them.
const CHEESE_STICK_GROUPS = [
  {
    key: 'dough',
    items: [
      'brownRiceFlourFine',
      'sorghumFlour',
      'tapiocaStarch',
      'potatoStarch',
      'psylliumHuskGround',
      'bakingPowder',
      'salt',
      'margarine',
      'cottageCheese',
      'sourCream',
      'gratedCheese',
    ],
  },
  {
    key: 'topping',
    items: [
      'meltedMargarine',
      'toppingCheese',
    ],
  },
];

const PIZZA2_GROUPS = [
  {
    key: 'flour',
    titleKey: 'common.flour',
    items: [
      'sorghumUnimix',
      'potatoStarch',
      'brownRiceFlour',
      'psylliumHusk',
    ],
  },
  {
    key: 'wet',
    titleKey: 'common.wetIngredients',
    items: [
      'waterTangzhong',
      'waterGel',
      'waterYeast',
      'oil',
      'honey',
    ],
  },
  {
    key: 'dry',
    titleKey: 'common.dryIngredients',
    items: [
      'salt',
      'yeast',
    ],
  },
];

const PIZZA3_GROUPS = [
  {
    key: 'flour',
    titleKey: 'common.flour',
    items: [
      'buckwheatFlour',
      'sorghumFlour',
      'cornStarch',
      'potatoStarch',
      'tapiocaStarch',
      'psylliumHusk',
    ],
  },
  {
    key: 'wet',
    titleKey: 'common.wetIngredients',
    items: [
      'waterGel',
      'waterYeast',
      'oil',
      'honey',
    ],
  },
  {
    key: 'dry',
    titleKey: 'common.dryIngredients',
    items: [
      'salt',
      'freshYeast',
    ],
  },
];

// Recipes whose ingredients render from a group list rather than their own block.
const INGREDIENT_GROUPS = { 'pizza-2': PIZZA2_GROUPS, 'pizza-3': PIZZA3_GROUPS };

export function DynamicRecipeView({ recipe, onBack, onStartCooking }) {
  useKeepAwake();
  const { t } = useI18n();

  // Determine initial value and step size based on recipe type
  const stepSize = recipe.stepSize || 1;
  const initialValue = String(recipe.initialValue || 1);
  const minValue = stepSize;

  const [count, setCount] = useState(initialValue);
  const [pizzaTangzhong, setPizzaTangzhong] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Notes state
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [noteEditorVisible, setNoteEditorVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [notesRefreshTrigger, setNotesRefreshTrigger] = useState(0);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const handleAddNote = () => {
    setEditingNote(null);
    setNoteEditorVisible(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteEditorVisible(true);
  };

  const handleNoteSaved = () => {
    setNotesRefreshTrigger(prev => prev + 1);
  };

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
  const isPancakes = recipe.id === 'pancakes';
  const isCheeseSticks = recipe.id === 'cheese-sticks';
  const isPizza2 = recipe.id === 'pizza-2';
  const isPizza3 = recipe.id === 'pizza-3';
  const ingredientGroups = INGREDIENT_GROUPS[recipe.id];
  const ingredients = isPizza
    ? calculatePizzaIngredients(count)
    : isPizza2
    ? calculatePizza2Ingredients(count, pizzaTangzhong)
    : isPizza3
    ? calculatePizza3Ingredients(count)
    : isWaffle
    ? calculateWaffleIngredients(count)
    : isPancakes
    ? calculatePancakeIngredients(count)
    : isCheeseSticks
    ? calculateCheeseStickIngredients(count)
    : null;
  // A recipe can swap its steps for a variant, such as pizza dough 2 without its tangzhong.
  const activeRecipe =
    recipe.variantFor && ingredients ? { ...recipe, ...recipe.variantFor(ingredients) } : recipe;

  const canCook = !!(recipe.instructionsKey && recipe.cookingSteps && ingredients);

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <StatusBar style="dark" />

          <Header onBack={onBack} />

          <RecipeHero
            image={recipe.image}
            title={t(recipe.nameKey)}
            subtitle={t(recipe.descriptionKey)}
          />

          <Stepper
            label={t(recipe.howManyKey)}
            value={count}
            onChangeText={setCount}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            suffix={recipe.unitLabelKey ? t(recipe.unitLabelKey) : null}
          />

          {/* Pizza dough 2 tangzhong switch */}
          {isPizza2 && (
            <TouchableOpacity
              style={styles.switchCard}
              onPress={() => setPizzaTangzhong(!pizzaTangzhong)}
              activeOpacity={0.7}
            >
              <View style={styles.switchLabels}>
                <Text style={styles.switchLabel}>{t('recipes.pizza2.tangzhongLabel')}</Text>
                <Text style={styles.switchHint}>
                  {t(pizzaTangzhong ? 'recipes.pizza2.tangzhongOnHint' : 'recipes.pizza2.tangzhongOffHint')}
                </Text>
              </View>
              <Switch
                value={pizzaTangzhong}
                onValueChange={setPizzaTangzhong}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                // react-native-web colours the on-state thumb separately (teal by default)
                activeThumbColor={colors.surface}
                ios_backgroundColor={colors.border}
              />
            </TouchableOpacity>
          )}

          {/* Pizza-specific summary */}
          {(isPizza || isPizza2 || isPizza3) && ingredients && (
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
                />
                <IngredientRow
                  name={t('ingredients.universalGfFlour')}
                  amount={ingredients.glutenFreeFlour}
                  unit="g"
                />
              </View>

              <View style={styles.ingredientCard}>
                <Text style={styles.categoryTitle}>{t('common.wetIngredients')}</Text>
                <IngredientRow
                  name={t('ingredients.water')}
                  amount={ingredients.water}
                  unit="g"
                />
                <IngredientRow
                  name={t('ingredients.oil')}
                  amount={ingredients.oil}
                  unit="g"
                />
                <IngredientRow
                  name={t('ingredients.honey')}
                  amount={ingredients.honey}
                  unit="g"
                />
              </View>

              <View style={styles.ingredientCard}>
                <Text style={styles.categoryTitle}>{t('common.dryIngredients')}</Text>
                <IngredientRow
                  name={t('ingredients.salt')}
                  amount={ingredients.salt}
                  unit="g"
                />
                <IngredientRow
                  name={t('ingredients.yeast')}
                  amount={ingredients.yeast}
                  unit="g"
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
                />
                <IngredientRow
                  name={t('ingredients.sugar')}
                  amount={ingredients.sugar}
                  unit="g"
                />
                <IngredientRow
                  name={t('ingredients.bakingPowder')}
                  amount={ingredients.bakingPowder}
                  unit="g"
                />
              </View>

              <View style={styles.ingredientCard}>
                <Text style={styles.categoryTitle}>{t('common.wetIngredients')}</Text>
                <IngredientRow
                  name={t('ingredients.egg')}
                  amount={ingredients.egg}
                  unit=""
                />
                <IngredientRow
                  name={t('ingredients.milk')}
                  amount={ingredients.milk}
                  unit="ml"
                />
                <IngredientRow
                  name={t('ingredients.butter')}
                  amount={ingredients.butter}
                  unit="g"
                />
                <IngredientRow
                  name={t('ingredients.vanilla')}
                  amount={ingredients.vanilla}
                  unit={` ${t('common.unitTsp')}`}
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

          {/* Pancake ingredients */}
          {isPancakes && ingredients && (
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
                  name={t('ingredients.riceFlour')}
                  amount={ingredients.riceFlour}
                  unit="g"
                />
                <IngredientRow
                  name={t('ingredients.sugar')}
                  amount={ingredients.sugar}
                  unit="g"
                />
                <IngredientRow
                  name={t('ingredients.bakingPowder')}
                  amount={ingredients.bakingPowder}
                  unit="g"
                />
                <IngredientRow
                  name={t('ingredients.salt')}
                  amount={ingredients.salt}
                  unit="g"
                />
              </View>

              <View style={styles.ingredientCard}>
                <Text style={styles.categoryTitle}>{t('common.wetIngredients')}</Text>
                <IngredientRow
                  name={t('ingredients.egg')}
                  amount={ingredients.egg}
                  unit=""
                />
                <IngredientRow
                  name={t('ingredients.butter')}
                  amount={ingredients.butter}
                  unit="g"
                />
                <IngredientRow
                  name={t('ingredients.milk')}
                  amount={ingredients.milk}
                  unit="ml"
                />
              </View>
            </Animated.View>
          )}

          {/* Pancake instructions */}
          {isPancakes && ingredients && recipe.instructionsKey && (
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

          {/* Cheese stick ingredients */}
          {isCheeseSticks && ingredients && (
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
              <Text style={styles.metaText}>{t(recipe.metaKey)}</Text>

              {CHEESE_STICK_GROUPS.map((group) => (
                <View key={group.key} style={styles.ingredientCard}>
                  <Text style={styles.categoryTitle}>
                    {t(`recipes.cheeseSticks.groups.${group.key}`)}
                  </Text>
                  {group.items.map((key) => {
                    const spoon = recipe.ingredientUnits[key];
                    return (
                      <IngredientRow
                        key={key}
                        name={t(`${recipe.ingredientNamesKey}.${key}`)}
                        amount={ingredients[key]}
                        unit={
                          spoon ? ` ${t(spoon === 'tsp' ? 'common.unitTsp' : 'common.unitTbsp')}` : 'g'
                        }
                      />
                    );
                  })}
                </View>
              ))}
            </Animated.View>
          )}

          {/* Cheese stick instructions */}
          {isCheeseSticks && ingredients && recipe.instructionsKey && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.sectionTitle}>{t('common.instructions')}</Text>
              <View style={styles.instructionCard}>
                {t(recipe.instructionsKey).map((instruction, index) => {
                  const step = recipe.cookingSteps[index];
                  return (
                    <View key={index} style={styles.instructionRow}>
                      <View style={styles.instructionNumber}>
                        <Text style={styles.instructionNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.instructionBody}>
                        <Text style={styles.instructionTitle}>{t(recipe.stepTitlesKey)[index]}</Text>
                        <Text style={styles.instructionText}>{instruction}</Text>
                        {!!step && !!step.timerSeconds && (
                          <View style={styles.durationRow}>
                            <Icon name="timer" size={18} color={colors.primary} strokeWidth={2} />
                            <Text style={styles.durationText}>{formatDuration(step.timerSeconds, t)}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Grouped ingredients (pizza dough 2 and 3) */}
          {ingredientGroups && ingredients && (
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
              {ingredientGroups.map((group) => (
                <View key={group.key} style={styles.ingredientCard}>
                  <Text style={styles.categoryTitle}>{t(group.titleKey)}</Text>
                  {group.items.filter((key) => ingredients[key] > 0).map((key) => (
                    <IngredientRow
                      key={key}
                      name={t(
                        key === 'brownRiceFlour' && ingredients.tangzhong
                          ? 'ingredients.brownRiceFlourTangzhong'
                          : `ingredients.${key}`
                      )}
                      amount={ingredients[key]}
                      unit="g"
                    />
                  ))}
                </View>
              ))}
            </Animated.View>
          )}

          {/* Instructions for the grouped recipes, amounts filled in */}
          {ingredientGroups && ingredients && recipe.instructionsKey && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.sectionTitle}>{t('common.instructions')}</Text>
              <View style={styles.instructionCard}>
                {t(activeRecipe.instructionsKey).map((instruction, index) => (
                  <View key={index} style={styles.instructionRow}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>{fillAmounts(instruction, ingredients)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Recipe notes, for recipes that carry them */}
          {recipe.notesKey && ingredients && (
            <View style={styles.instructionsContainer}>
              <Text style={[styles.sectionTitle, styles.notesTitle]}>{t('common.recipeNotes')}</Text>
              <View style={styles.instructionCard}>
                {t(recipe.notesKey).map((note, index) => (
                  <View key={index} style={styles.instructionRow}>
                    <Text style={styles.noteBullet}>•</Text>
                    <Text style={styles.instructionText}>{note}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* My Notes Section */}
          <View style={styles.notesSection}>
            <TouchableOpacity
              style={styles.notesSectionHeader}
              onPress={() => setNotesExpanded(!notesExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>{t('notes.title')}</Text>
              <Icon
                name={notesExpanded ? 'chevronDown' : 'chevronRight'}
                size={20}
                color={colors.textSecondary}
                strokeWidth={2}
              />
            </TouchableOpacity>
            
            {notesExpanded && (
              <NotesList
                recipeId={recipe.id}
                onEditNote={handleEditNote}
                onAddNote={handleAddNote}
                onPhotoPress={setPreviewPhoto}
                refreshTrigger={notesRefreshTrigger}
              />
            )}
          </View>

          {/* Note Editor Modal */}
          <NoteEditor
            visible={noteEditorVisible}
            note={editingNote}
            recipeId={recipe.id}
            onClose={() => setNoteEditorVisible(false)}
            onSaved={handleNoteSaved}
          />

          {/* Photo Preview Modal */}
          <PhotoPreview
            visible={!!previewPhoto}
            photoUri={previewPhoto}
            onClose={() => setPreviewPhoto(null)}
          />
        </View>
      </ScrollView>
      {canCook && (
        <StartCookingBar
          label={t('common.startCooking')}
          onPress={() => onStartCooking(ingredients)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 32,
  },
  summaryBox: {
    backgroundColor: colors.inverse,
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    gap: 2,
  },
  summaryDivider: {
    width: 1,
    height: 48,
    marginHorizontal: 16,
    backgroundColor: colors.textSecondary,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.onInverseSecondary,
  },
  summaryValue: {
    fontSize: 34,
    fontFamily: fonts.display,
    color: colors.onInverse,
    fontVariant: ['tabular-nums'],
  },
  ingredientsContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: fonts.display,
    color: colors.text,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  ingredientCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  instructionsContainer: {
    marginTop: 12,
  },
  instructionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 4,
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
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  instructionNumberText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.primaryOnSoft,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
    lineHeight: 24,
  },
  instructionBody: {
    flex: 1,
    gap: 4,
  },
  instructionTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 20,
  },
  switchLabels: {
    flex: 1,
    gap: 3,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  switchHint: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  notesTitle: {
    marginTop: 24,
  },
  noteBullet: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.regular,
    color: colors.primary,
    marginRight: 12,
  },
  metaText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: -4,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  notesSection: {
    marginTop: 24,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    paddingBottom: 6,
  },
  notesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
});
