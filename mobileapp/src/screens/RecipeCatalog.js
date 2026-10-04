import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { layout } from '../constants/layout';
import { useI18n } from '../context/I18nContext';
import { useBottomInset } from '../hooks/useBottomInset';
import { recipes } from '../data/recipes';
import { LanguageSelector } from '../components/LanguageSelector';
import { Icon } from '../components/Icon';

// The calculators sit in a two-column grid; a recipe marked `featured` gets a
// full-width card under it instead (none is, at the moment).
const gridRecipes = recipes.filter((recipe) => !recipe.featured);
const featuredRecipes = recipes.filter((recipe) => recipe.featured);

const gridRows = [];
for (let index = 0; index < gridRecipes.length; index += 2) {
  gridRows.push(gridRecipes.slice(index, index + 2));
}

export function RecipeCatalog({ onSelectRecipe }) {
  const paddingBottom = useBottomInset(40);
  const { t } = useI18n();

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={[styles.container, { paddingBottom }]}>
      <StatusBar style="dark" />

      <View style={styles.topBar}>
        <View style={styles.brand}>
          <View style={styles.brandMark}>
            <Icon name="loaf" size={20} color={colors.onPrimary} strokeWidth={1.9} />
          </View>
          <Text style={styles.brandName}>{t('app.title')}</Text>
        </View>
        <LanguageSelector />
      </View>

      <View style={styles.grid}>
        {gridRows.map((row) => (
          <View key={row[0].id} style={styles.gridRow}>
            {row.map((recipe) => (
              <Pressable
                key={recipe.id}
                style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
                onPress={() => onSelectRecipe(recipe.id)}
                accessibilityRole="button"
              >
                <Image source={recipe.image} style={styles.tileArt} resizeMode="cover" />
                <View style={styles.tileBody}>
                  <Text style={styles.tileName}>{t(recipe.nameKey)}</Text>
                  <Text style={styles.tileDescription} numberOfLines={2}>
                    {t(recipe.descriptionKey)}
                  </Text>
                </View>
              </Pressable>
            ))}
            {row.length === 1 && <View style={styles.tileSpacer} />}
          </View>
        ))}
      </View>

      {featuredRecipes.map((recipe) => (
        <Pressable
          key={recipe.id}
          style={({ pressed }) => [styles.feature, pressed && styles.featurePressed]}
          onPress={() => onSelectRecipe(recipe.id)}
          accessibilityRole="button"
        >
          <Image source={recipe.image} style={styles.featureArt} resizeMode="cover" />
          <View style={styles.featureBody}>
            <Text style={styles.featureName}>{t(recipe.nameKey)}</Text>
            <Text style={styles.featureDescription}>{t(recipe.descriptionKey)}</Text>
          </View>
          <Icon name="arrowRight" size={24} color={colors.onPrimary} strokeWidth={2} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: layout.gutter,
    paddingTop: layout.screenTop,
    paddingBottom: 40,
    gap: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.text,
    flexShrink: 1,
  },
  grid: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  tilePressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  tileSpacer: {
    flex: 1,
  },
  tileArt: {
    width: '100%',
    height: 112,
    backgroundColor: colors.primarySoft,
  },
  tileBody: {
    padding: 14,
    paddingBottom: 16,
    gap: 4,
  },
  tileName: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  tileDescription: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 22,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 5,
  },
  featurePressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  featureArt: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  featureBody: {
    flex: 1,
    gap: 4,
  },
  featureName: {
    fontSize: 22,
    fontFamily: fonts.display,
    color: colors.onPrimary,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.regular,
    color: colors.primarySoft,
  },
});
