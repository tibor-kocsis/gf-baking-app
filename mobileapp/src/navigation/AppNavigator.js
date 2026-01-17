import { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { recipes } from '../data/recipes';
import { RecipeCatalog } from '../screens/RecipeCatalog';
import { DynamicRecipeView } from '../screens/DynamicRecipeView';

export function AppNavigator() {
  const [screen, setScreen] = useState({ type: 'catalog' });

  const navigateToRecipe = (recipeId) => {
    setScreen({ type: 'recipe', recipeId });
  };

  const navigateToCatalog = () => {
    setScreen({ type: 'catalog' });
  };

  // Handle hardware back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen.type !== 'catalog') {
        navigateToCatalog();
        return true; // Handled - don't exit app
      }
      return false; // Not handled - let system handle (exit app)
    });

    return () => backHandler.remove();
  }, [screen.type]);

  if (screen.type === 'catalog') {
    return <RecipeCatalog onSelectRecipe={navigateToRecipe} />;
  }

  const recipe = recipes.find(r => r.id === screen.recipeId);
  if (!recipe) {
    return <RecipeCatalog onSelectRecipe={navigateToRecipe} />;
  }

  return <DynamicRecipeView recipe={recipe} onBack={navigateToCatalog} />;
}
