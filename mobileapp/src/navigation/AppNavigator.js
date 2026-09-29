import { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useI18n } from '../context/I18nContext';
import { findRecipe } from '../data/recipes';
import { RecipeCatalog } from '../screens/RecipeCatalog';
import { RecipeView } from '../screens/RecipeView';
import { FlourMixCalculatorView } from '../screens/FlourMixCalculatorView';
import { CookingModeView } from '../screens/CookingModeView';

// The screen for each recipe type in the catalog.
const RECIPE_SCREENS = {
  scaled: RecipeView,
  'flour-mix': FlourMixCalculatorView,
};

const CATALOG = { type: 'catalog' };

// Where the back button leads from a screen, or null to let the system exit.
// Plain state only: the back handler must never build JSX.
export function backTarget(screen) {
  if (screen.type === 'cooking') return { type: 'recipe', recipeId: screen.recipeId };
  if (screen.type === 'recipe') return CATALOG;
  return null;
}

// A screen-state stack of depth three: catalog -> recipe -> cooking mode.
export function AppNavigator() {
  const { t } = useI18n();
  const [screen, setScreen] = useState(CATALOG);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const target = backTarget(screen);
      if (!target) return false;
      setScreen(target);
      return true;
    });
    return () => subscription.remove();
  }, [screen]);

  const goBack = () => setScreen(backTarget(screen) || CATALOG);
  const recipe = screen.recipeId ? findRecipe(screen.recipeId) : null;

  if (!recipe) {
    return <RecipeCatalog onSelectRecipe={(recipeId) => setScreen({ type: 'recipe', recipeId })} />;
  }

  if (screen.type === 'cooking') {
    return <CookingModeView title={t(recipe.nameKey)} plan={screen.plan} onBack={goBack} />;
  }

  const RecipeScreen = RECIPE_SCREENS[recipe.type];
  return (
    <RecipeScreen
      recipe={recipe}
      onBack={goBack}
      onStartCooking={(plan) => setScreen({ type: 'cooking', recipeId: recipe.id, plan })}
    />
  );
}
