## Context

The Gluten Free Baking app is built with React Native (Expo SDK 54) and currently exists as a single `App.js` file with 1063 lines. The app includes:
- i18n system with English and Hungarian support
- Recipe catalog with 3 recipes (pizza dough, sandwich bread, waffles)
- Two recipe types: dynamic (calculators) and static (fixed ingredients)
- Custom navigation state management

Stakeholders:
- Solo developer/maintainer who needs quick code navigation
- Future contributors who need clear separation of concerns
- Users who expect consistent, bug-free behavior after refactor

Constraints:
- Must maintain 100% behavioral parity with current implementation
- No new dependencies (use only React Native and existing packages)
- Expo managed workflow (no native code)
- Support for web, iOS, and Android platforms

## Goals / Non-Goals

### Goals
1. Organize code into logical, single-purpose modules
2. Separate business logic from UI components
3. Make it easy to add new recipes without touching existing code
4. Enable future unit testing of calculation logic
5. Create clear patterns for future feature development
6. Document the architecture in project.md

### Non-Goals
1. NOT introducing external state management (Redux, MobX, Zustand)
2. NOT adding a navigation library (React Navigation) - keep simple state-based navigation
3. NOT changing any visual appearance or behavior
4. NOT adding TypeScript (keep JavaScript for simplicity)
5. NOT creating abstract base classes or complex inheritance

## Decisions

### Decision 1: Feature-Based Directory Structure

**Choice**: Organize by technical layer (screens, components, utils) rather than feature
**Why**: With 3 recipes and limited features, a feature-based structure would be overkill. Layer-based is simpler and more familiar to React Native developers.

```
src/
├── constants/     # Static configuration values
├── context/       # React Context providers
├── data/          # Data definitions and schemas
├── utils/         # Pure functions and helpers
├── components/    # Reusable UI components
├── screens/       # Full-page views
└── navigation/    # Navigation state management
```

**Alternatives considered**:
- Feature-based (`src/recipes/`, `src/i18n/`, `src/settings/`) - More scalable but adds complexity now
- Domain-driven (`src/domain/`, `src/presentation/`) - Overkill for this app size

### Decision 2: Keep React Context for State

**Choice**: Continue using React Context for i18n and navigation state
**Why**: The app has minimal global state (language preference and current screen). Context is built-in, requires no dependencies, and is sufficient for this use case.

**Alternatives considered**:
- Redux - Too heavy for 2 pieces of global state
- Zustand - Adds dependency for minimal benefit
- Prop drilling - Would couple components unnecessarily

### Decision 3: Calculation Logic as Pure Functions

**Choice**: Extract `calculatePizzaIngredients` and `calculateWaffleIngredients` to `src/utils/recipeCalculators.js`
**Why**:
- Enables unit testing without rendering components
- Makes the formula easy to modify without touching UI
- Allows reuse if needed (e.g., for future "share recipe" feature)

Pattern:
```javascript
// src/utils/recipeCalculators.js
export function calculatePizzaIngredients(count) {
  // Pure function: input -> output, no side effects
}
```

### Decision 4: Recipe Data as Static Definitions

**Choice**: Keep recipes as static JavaScript objects in `src/data/recipes.js`
**Why**:
- Recipes don't change at runtime
- No backend/API exists
- Simple import statements work well
- Easy to add new recipes by extending the array

**Alternatives considered**:
- JSON files - Would require additional parsing, no benefit
- Database/AsyncStorage - App works offline, recipes are bundled
- Generated from CMS - No CMS exists

### Decision 5: Shared Components for DRY

**Choice**: Extract these reusable components:
- `Header` - Back button + title pattern used in all recipe views
- `IngredientRow` - Emoji + name + amount pattern used in all recipe views
- `LanguageSelector` - Toggle buttons for EN/HU

**Why**: These patterns repeat 3+ times and are clearly reusable.

**NOT extracting**:
- Input stepper (+/-/input) - Only used in dynamic recipes, but tightly coupled to that context
- Summary box - Only used in pizza recipe
- Instruction list - Could be shared but variations exist (waffle vs bread)

### Decision 6: Simple Navigation Pattern

**Choice**: Keep navigation as React state in a single component
```javascript
// src/navigation/AppNavigator.js
export function AppNavigator() {
  const [screen, setScreen] = useState({ type: 'catalog' });
  // Render appropriate screen based on state
}
```

**Why**: The app has only 4 screens (catalog + 3 recipes). State-based navigation is explicit and easy to understand.

**Alternatives considered**:
- React Navigation - Adds ~150KB to bundle, overkill for 4 screens
- File-based routing (Expo Router) - Would require structural changes beyond scope

### Decision 7: Styles Colocated with Components

**Choice**: Keep StyleSheet definitions in the same file as the component that uses them
**Why**:
- Components are self-contained
- Easy to modify styles when editing component
- No need to switch files for simple style changes

**Alternatives considered**:
- Global styles file - Makes components dependent on external file
- Styled-components - Adds dependency, changes syntax
- Separate `*.styles.js` files - Adds file count without clear benefit at this scale

### Decision 8: Project.md Architecture Section

**Choice**: Add a dedicated "Architecture Patterns" section to project.md documenting:
- Directory structure and purpose of each folder
- How to add a new recipe (step-by-step)
- How to add a new language
- Component naming conventions

**Why**: Self-documenting code is not enough. New contributors need explicit guidance.

## Risks / Trade-offs

### Risk: Import Path Complexity
**Issue**: Moving from single file to 10+ files means more import statements
**Mitigation**: Use clear, consistent naming so imports are predictable
**Trade-off accepted**: Slightly more boilerplate for much better organization

### Risk: Circular Dependencies
**Issue**: With modules importing each other, cycles could occur
**Mitigation**:
- Data and utils have no dependencies on components
- Components only import from constants, context, and utils
- Screens import from components
- Clear dependency direction: data/utils -> components -> screens

### Risk: Behavioral Regression
**Issue**: Refactoring could introduce subtle bugs
**Mitigation**:
- Manual testing of all user flows after refactor
- Compare bundle output to verify no missing code
- Future: add unit tests for calculation logic

## Migration Plan

### Phase 1: Create Structure (Non-Breaking)
1. Create `src/` directory and subdirectories
2. Copy (not move) code to new locations
3. Verify new files have no syntax errors

### Phase 2: Wire Up Imports
1. Update App.js to import from new modules
2. Ensure all exports are correct
3. Run app and verify functionality

### Phase 3: Clean Up
1. Remove duplicate code from App.js
2. App.js becomes thin entry point only
3. Final verification

### Phase 4: Documentation
1. Update project.md with architecture section
2. Add inline comments where patterns aren't obvious

### Rollback Plan
- All changes are in new files until Phase 3
- If issues arise, delete `src/` and keep original App.js
- Git history preserves original implementation

## Open Questions

1. **Styles organization**: Should shared styles (colors, spacing values) live in constants or a separate `styles/` folder?
   - **Proposed answer**: Keep in `constants/colors.js` for simplicity. Add `constants/spacing.js` if needed later.

2. **Future recipe types**: If a third recipe type is added (e.g., "guided" with step-by-step mode), where would it live?
   - **Proposed answer**: New screen in `screens/`, new type in recipe data. Current architecture supports this.

3. **Testing strategy**: Should this refactor include adding tests?
   - **Proposed answer**: Out of scope for this change. Architecture enables testing; actual tests are a separate effort.
