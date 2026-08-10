import { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { recipes } from '../data/recipes';
import { RecipeCatalog } from '../screens/RecipeCatalog';
import { DynamicRecipeView } from '../screens/DynamicRecipeView';
import { CookingModeView } from '../screens/CookingModeView';

export function AppNavigator() {
  const [screen, setScreen] = useState({ type: 'catalog' });

  const navigateToRecipe = (recipeId) => {
    setScreen({ type: 'recipe', recipeId });
  };

  const navigateToCatalog = () => {
    setScreen({ type: 'catalog' });
  };

  const navigateToCooking = (recipeId, ingredients) => {
    setScreen({ type: 'cooking', recipeId, ingredients });
  };

  const navigateBackFromCooking = () => {
    setScreen({ type: 'recipe', recipeId: screen.recipeId });
  };

  // Handle hardware back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen.type === 'cooking') {
        navigateBackFromCooking();
        return true;
      }
      if (screen.type === 'recipe') {
        navigateToCatalog();
        return true;
      }
      return false; // Not handled - let system handle (exit app)
    });

    return () => backHandler.remove();
  }, [screen.type, screen.recipeId]);

  if (screen.type === 'catalog') {
    return <RecipeCatalog onSelectRecipe={navigateToRecipe} />;
  }

  const recipe = recipes.find(r => r.id === screen.recipeId);
  if (!recipe) {
    return <RecipeCatalog onSelectRecipe={navigateToRecipe} />;
  }

  if (screen.type === 'cooking') {
    return (
      <CookingModeView
        recipe={recipe}
        ingredients={screen.ingredients}
        onBack={navigateBackFromCooking}
      />
    );
  }

  return (
    <DynamicRecipeView
      recipe={recipe}
      onBack={navigateToCatalog}
      onStartCooking={(ingredients) => navigateToCooking(recipe.id, ingredients)}
    />
  );
}
