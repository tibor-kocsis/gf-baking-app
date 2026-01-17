# Project Context

## Purpose
Gluten Free Baking is a mobile app that serves as a comprehensive gluten-free recipe companion. It features a recipe catalog with both interactive calculators (for scalable recipes like pizza dough) and static recipes (with fixed ingredient lists and instructions).

## Tech Stack
- **Framework**: React Native with Expo SDK 54
- **Language**: JavaScript (ES6+)
- **React**: 19.1.0
- **UI**: React Native core components + Animated API
- **Platforms**: iOS, Android, Web (via react-native-web)

## App Structure

### Recipe Catalog (Home Screen)
- Scrollable list of recipe cards
- Each card displays: name, icon/emoji, short description, type badge
- Two recipe types: "Calculator" (dynamic) and "Recipe" (static)

### Recipe Types
- **Dynamic (Calculator)**: Scalable recipes where users adjust quantity to recalculate ingredients (e.g., pizza dough)
- **Static**: Fixed ingredient lists with preparation instructions (e.g., sandwich bread)

### Initial Recipe Set
- Pizza Dough (dynamic calculator)
- Sandwich Bread (static recipe)

## UI Design

### Color Palette
- Primary: Warm brown tones (inspired by baking)
- Background: Warm off-white (flour-inspired)
- Accents: Golden wheat or olive green

### Layout
- Card-based design with rounded corners and subtle shadows
- Consistent padding and spacing throughout
- Clear typography hierarchy (large bold titles, uppercase section headers)

### Interactions
- Visual feedback on button presses (opacity, scale, or color shift)
- Smooth animations for calculation updates

## Project Conventions

### Code Style
- Functional components with React hooks (useState, useEffect, useRef)
- Component functions use PascalCase (e.g., `RecipeCard`)
- Handler functions use camelCase with "handle" prefix (e.g., `handleRecipePress`)
- StyleSheet defined at bottom of component file
- Inline styles avoided in favor of StyleSheet references

### Architecture Patterns
- Recipe data stored as structured objects with type field
- Navigation between catalog and detail views
- Calculation logic separated for dynamic recipes
- Animations use React Native Animated API with native driver

### Testing Strategy
- Jest + React Native Testing Library for unit and component tests
- Test calculation logic separately from UI components

### Git Workflow
- Trunk-based development: commit directly to main with small, frequent changes
- Keep commits focused and atomic
- Write descriptive commit messages

## Domain Context

### Pizza Dough Recipe (Dynamic)
- Each pizza = 300g total dough weight
- Flour ratio: 60% sorghum flour, 40% universal gluten-free flour
- Other ingredients as percentages of flour weight:
  - Water: 80%
  - Salt: 3%
  - Yeast: 1.5%
  - Oil: 5%
  - Honey: 5%
- Flour amounts rounded to nearest 25g

### Sandwich Bread Recipe (Static)
- Fixed ingredient list with amounts
- Step-by-step preparation instructions
- Ingredients grouped by category (dry, wet, etc.)

## Internationalization (i18n)
- **Supported Languages**: English (en), Hungarian (hu)
- **Default Language**: Device locale if supported, otherwise English
- **Language Selection**: Available at the bottom of the main catalog screen
- **Persistence**: User's language preference is stored locally and restored on app launch

## Important Constraints
- All recipes must be gluten-free (no wheat flour)
- App should work offline (no backend required)
- Support metric measurements (grams)

## Development Environment
- **Container**: VS Code devcontainer (Ubuntu-based)
- **Forwarded Ports**: 5173 (Vite), 3000 (general), 8081 (Expo Metro bundler)
- **Mobile Testing**: Use `npm run start:lan` or `npx expo start --tunnel` to expose Expo to physical devices
- **Host Access**: Set `REACT_NATIVE_PACKAGER_HOSTNAME=<HOST_IP>` when LAN mode doesn't detect the correct IP

## External Dependencies
- Expo managed workflow (no native code modifications)
- EAS Build for generating APK/IPA files

## App Branding
- **Name**: Gluten Free Baking
- **iOS Bundle ID**: com.glutenfreebaking.app
- **Android Package**: com.glutenfreebaking.app
