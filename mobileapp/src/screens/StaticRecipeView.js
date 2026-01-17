import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { useI18n } from '../context/I18nContext';
import { Header } from '../components/Header';
import { IngredientRow } from '../components/IngredientRow';

export function StaticRecipeView({ recipe, onBack }) {
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
