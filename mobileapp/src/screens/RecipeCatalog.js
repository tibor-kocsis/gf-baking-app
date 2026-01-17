import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { useI18n } from '../context/I18nContext';
import { recipes } from '../data/recipes';
import { LanguageSelector } from '../components/LanguageSelector';

export function RecipeCatalog({ onSelectRecipe }) {
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
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <LanguageSelector />
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
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
});
