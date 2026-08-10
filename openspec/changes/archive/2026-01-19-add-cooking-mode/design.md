## Context
The app currently has two types of recipe views (DynamicRecipeView for calculators). Users can see ingredients and instructions but cannot track their cooking progress. The cooking mode feature needs to work across all recipe types and integrate with the existing multiplier/calculator functionality.

## Goals / Non-Goals
- Goals:
  - Provide an interactive step-by-step cooking experience
  - Allow users to check off ingredients as they add them
  - Allow users to check off steps as they complete them
  - Intelligently combine ingredients with their relevant instruction steps
  - Maintain calculated ingredient amounts from the recipe view
  - Support both Hungarian and English languages

- Non-Goals:
  - Persisting progress across app restarts (session-only)
  - Timer functionality for steps
  - Voice control or hands-free mode
  - Offline caching of progress

## Decisions

### Step-Ingredient Association Strategy
- **Decision**: Define step-ingredient mappings in recipe data, where each recipe has a `cookingSteps` array that references instruction indices and ingredient keys
- **Why**:
  - Instructions are stored as translation arrays, making runtime parsing unreliable
  - Explicit mappings allow precise control over which ingredients appear at which step
  - Supports recipes where ingredients span multiple steps
  - Easy to extend for new recipes

### State Management
- **Decision**: Use React useState within CookingModeView for progress tracking
- **Why**:
  - Progress is session-scoped, no persistence needed
  - Keeps implementation simple without adding complexity
  - Consistent with existing patterns (no external state libraries)

### Navigation Flow
- **Decision**: Add cooking mode as a third screen type in AppNavigator
- **Why**:
  - Follows existing pattern of screen-based navigation
  - Preserves recipe context and multiplier when entering cooking mode
  - Allows easy back navigation to recipe view

### Data Structure for Cooking Steps
```javascript
// In recipes.js per recipe
cookingSteps: [
  {
    instructionIndex: 0, // Index into instructions array
    ingredients: ['yeast', 'lemonJuice', 'honey', 'water'], // Keys from ingredients
  },
  {
    instructionIndex: 1,
    ingredients: ['sorghumFlour', 'universalGfFlour', 'psylliumHusk', 'salt'],
  },
  // Steps without ingredients for action-only steps
  {
    instructionIndex: 5,
    ingredients: [],
  },
]
```

## Risks / Trade-offs

### Risk: Step-ingredient mappings require manual curation
- **Mitigation**: Clear documentation in recipe data; only needed once per recipe
- **Trade-off accepted**: Manual work for accuracy vs automated parsing that may be unreliable

### Risk: Calculated amounts need to flow into cooking mode
- **Mitigation**: Pass calculated ingredients object when navigating to cooking mode; no recalculation needed

### Risk: Long step text may not fit well on mobile
- **Mitigation**: Use scrollable step cards with readable typography; test on various screen sizes

## Open Questions
- None - ready for implementation
