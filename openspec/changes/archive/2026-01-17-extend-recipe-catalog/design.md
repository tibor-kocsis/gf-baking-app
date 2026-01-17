# Design: Extend Recipe Catalog

## Context
The app is transforming from a single-purpose pizza calculator to a multi-recipe gluten-free baking app. This requires:
- Supporting two distinct recipe types (dynamic calculators and static recipes)
- Implementing navigation between catalog and recipe views
- Updating the visual design to a modern, earthy palette

## Goals / Non-Goals

### Goals
- Create extensible recipe data structure that supports both recipe types
- Maintain existing pizza calculator functionality
- Implement clean navigation without external navigation libraries
- Apply consistent modern design across all screens

### Non-Goals
- Backend/API integration (recipes remain local)
- User-created recipes or favorites
- Recipe search or filtering (only 2 recipes initially)
- Offline persistence beyond what Expo provides

## Decisions

### Recipe Data Structure
**Decision**: Use a discriminated union pattern with `type: 'dynamic' | 'static'` field.

```javascript
// Dynamic recipe (calculator)
{
  id: 'pizza',
  type: 'dynamic',
  name: 'Pizza Dough',
  icon: '🍕',
  description: 'Gluten-free pizza dough calculator',
  unitLabel: 'pizzas',
  baseWeight: 300, // grams per unit
  ingredients: [
    { name: 'Sorghum flour', ratio: 0.6, category: 'flour', emoji: '🌿' },
    // ... percentages of flour weight
  ],
  calculateIngredients: (count) => { /* calculation logic */ }
}

// Static recipe
{
  id: 'sandwich-bread',
  type: 'static',
  name: 'Sandwich Bread',
  icon: '🍞',
  description: 'Gluten-free sandwich bread',
  ingredients: [
    { name: 'Sorghum flour', amount: 170, unit: 'g', emoji: '🌿' },
    // ... fixed amounts
  ],
  instructions: [
    'Add yeast, lemon juice and honey to warm water',
    // ... step by step
  ]
}
```

**Alternatives considered**:
- Separate data files per recipe type: Rejected - adds unnecessary complexity for 2 recipes
- Single flat structure with optional fields: Rejected - less type-safe, harder to extend

### Navigation Approach
**Decision**: Use React state-based navigation with a simple screen stack.

```javascript
const [currentScreen, setCurrentScreen] = useState({ type: 'catalog' });
// or { type: 'recipe', recipeId: 'pizza' }
```

**Alternatives considered**:
- React Navigation library: Rejected - overkill for 2 screens, adds bundle size
- URL-based routing: Rejected - not needed for mobile app with simple flow

### Color Palette (Earthy/Natural)
**Decision**: New palette inspired by baking and natural ingredients:

```javascript
const colors = {
  primary: '#8B7355',      // Warm brown (bread crust)
  primaryLight: '#A69076', // Light brown
  secondary: '#6B8E23',    // Olive green (herbs)
  background: '#FAF8F5',   // Warm off-white (flour)
  surface: '#FFFFFF',      // White cards
  text: '#3D3D3D',         // Dark charcoal
  textSecondary: '#6B6B6B', // Medium gray
  accent: '#D4A574',       // Golden wheat
  border: '#E8E4DF',       // Subtle warm gray
};
```

**Alternatives considered**:
- Keep orange (#FF6B35): User requested change to earthy palette
- Cool minimalist: Less fitting for baking/food theme

### Component Architecture
**Decision**: Single-file architecture with logical sections, following existing pattern.

```
App.js
├── State management (recipes, navigation)
├── RecipeCatalog component
├── DynamicRecipeView component (refactored pizza calc)
├── StaticRecipeView component
├── Shared sub-components (IngredientRow, Header, etc.)
└── StyleSheet
```

**Alternatives considered**:
- Multi-file components: Rejected per project conventions ("Single-file component structure for simple apps")

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Breaking existing pizza functionality | Extract calculator logic carefully, test before/after |
| State-based nav may not scale | Acceptable for 2 screens; can migrate later if needed |
| Large single file | Keep components focused, clear section comments |

## Migration Plan

1. Add recipe data structures alongside existing code
2. Create new components (catalog, static view)
3. Refactor pizza calculator into DynamicRecipeView
4. Update App.js to use navigation and new home screen
5. Apply new color palette across all styles
6. Update app.json branding

No data migration needed - app has no persistent user data.

## Open Questions

None - requirements are clear from user input.
