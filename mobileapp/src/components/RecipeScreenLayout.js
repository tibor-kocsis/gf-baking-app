import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
import { View, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { layout } from '../constants/layout';
import { useI18n } from '../context/I18nContext';
import { useBottomInset } from '../hooks/useBottomInset';
import { Header } from './Header';
import { RecipeHero } from './RecipeHero';
import { RecipeNotesSection } from './RecipeNotesSection';
import { StartCookingBar } from './StartCookingBar';

// The frame every recipe screen shares: back button, hero, the screen's own
// content, the baker's notes, and the cooking-mode button pinned below when
// `onStartCooking` is given. Keeps the screen on while the baker weighs.
export function RecipeScreenLayout({ recipe, onBack, onStartCooking, children }) {
  useKeepAwake();
  const { t } = useI18n();
  // The pinned bar clears the navigation bar itself; without it the scroll content does.
  const paddingBottom = useBottomInset(layout.screenBottom);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.container, !onStartCooking && { paddingBottom }]}>
        <Header onBack={onBack} />
        <RecipeHero image={recipe.image} title={t(recipe.nameKey)} subtitle={t(recipe.descriptionKey)} />
        {children}
        <RecipeNotesSection recipeId={recipe.id} />
      </ScrollView>
      {!!onStartCooking && <StartCookingBar label={t('common.startCooking')} onPress={onStartCooking} />}
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
    paddingHorizontal: layout.gutter,
    paddingTop: layout.screenTop,
    paddingBottom: layout.screenBottom,
  },
});
