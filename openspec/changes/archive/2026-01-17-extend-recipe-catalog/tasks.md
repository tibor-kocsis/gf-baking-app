# Tasks: Extend Recipe Catalog

## 1. App Branding & Configuration
- [x] 1.1 Update `app.json` with new app name "Gluten Free Baking"
- [x] 1.2 Update bundle identifier to `com.glutenfreebaking.app`
- [x] 1.3 Update splash screen background color to new palette

## 2. Data Architecture
- [x] 2.1 Create recipe data structure with type discriminator (dynamic/static)
- [x] 2.2 Define pizza recipe data (dynamic type)
- [x] 2.3 Define sandwich bread recipe data (static type)
- [x] 2.4 Create recipes index/registry

## 3. Recipe Catalog Screen (Home)
- [x] 3.1 Create RecipeCatalog component as new home screen
- [x] 3.2 Implement recipe list with cards showing name, type badge, and image/icon
- [x] 3.3 Add navigation to recipe detail screens
- [x] 3.4 Apply new earthy/natural color palette

## 4. Dynamic Recipe View (Calculator)
- [x] 4.1 Refactor existing pizza calculator into reusable DynamicRecipeView
- [x] 4.2 Accept recipe data as props for flexibility
- [x] 4.3 Update styling to match new design system
- [x] 4.4 Add back navigation to catalog

## 5. Static Recipe View
- [x] 5.1 Create StaticRecipeView component for fixed recipes
- [x] 5.2 Display ingredients list (not scalable)
- [x] 5.3 Display preparation instructions
- [x] 5.4 Apply consistent styling with design system
- [x] 5.5 Add back navigation to catalog

## 6. Design System Updates
- [x] 6.1 Define new color palette (earthy/natural tones)
- [x] 6.2 Update card components with modern styling
- [x] 6.3 Create consistent typography scale
- [x] 6.4 Update button and input styles
- [x] 6.5 Add subtle animations and transitions

## 7. Navigation
- [x] 7.1 Implement screen navigation (catalog <-> recipe detail)
- [x] 7.2 Add header with app title and back button where applicable
- [x] 7.3 Ensure smooth transitions between screens

## 8. Testing & Validation
- [x] 8.1 Verify pizza calculator still works correctly
- [x] 8.2 Verify sandwich bread recipe displays correctly
- [x] 8.3 Test navigation flow between screens
- [x] 8.4 Test on both iOS and Android platforms
