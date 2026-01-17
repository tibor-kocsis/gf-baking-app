import { useState } from 'react';
import { recipes } from '../data/recipes';
import { RecipeCatalog } from '../screens/RecipeCatalog';
import { DynamicRecipeView } from '../screens/DynamicRecipeView';
import { StaticRecipeView } from '../screens/StaticRecipeView';

export function AppNavigator() {
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
