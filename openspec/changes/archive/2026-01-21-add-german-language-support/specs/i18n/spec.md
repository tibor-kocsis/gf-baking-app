# i18n Specification Updates

## MODIFIED Requirements

### Requirement: Supported Languages
The app SHALL support English, Hungarian, and German languages for all user-facing content.

#### Scenario: English language support
- **WHEN** the user selects English as the language
- **THEN** all UI text, recipe names, descriptions, ingredients, and instructions are displayed in English

#### Scenario: Hungarian language support
- **WHEN** the user selects Hungarian as the language
- **THEN** all UI text, recipe names, descriptions, ingredients, and instructions are displayed in Hungarian

#### Scenario: German language support
- **WHEN** the user selects German as the language
- **THEN** all UI text, recipe names, descriptions, ingredients, and instructions are displayed in German

### Requirement: Language Selection UI
The app SHALL provide a language selector on the main catalog screen for users to change the display language using a bottom sheet pattern.

#### Scenario: Language selector button visibility
- **WHEN** the user is on the recipe catalog screen
- **THEN** a language selector button is visible at the bottom of the screen
- **AND** the button displays the current language name (e.g., "English", "Magyar", "Deutsch")

#### Scenario: Opening language selection
- **WHEN** the user taps the language selector button
- **THEN** a bottom sheet modal opens displaying all available languages
- **AND** each language is shown with its native name (English, Magyar, Deutsch)
- **AND** the current language is indicated visually

#### Scenario: Changing language to German
- **WHEN** the user taps on "Deutsch" in the language selection bottom sheet
- **THEN** the bottom sheet closes
- **AND** the app immediately updates all displayed text to German
- **AND** the language preference is saved for future sessions

### Requirement: Default Language Detection
The app SHALL default to the device's system language when supported, otherwise default to English.

#### Scenario: Device language is German
- **WHEN** the app launches for the first time
- **AND** the device system language is German
- **THEN** the app displays content in German

#### Scenario: Device language is Hungarian
- **WHEN** the app launches for the first time
- **AND** the device system language is Hungarian
- **THEN** the app displays content in Hungarian

#### Scenario: Device language is English
- **WHEN** the app launches for the first time
- **AND** the device system language is English
- **THEN** the app displays content in English

#### Scenario: Device language is unsupported
- **WHEN** the app launches for the first time
- **AND** the device system language is not English, Hungarian, or German
- **THEN** the app defaults to English

### Requirement: Translated Recipe Content
The app SHALL provide translations for all recipe content including names, descriptions, ingredient names, and instructions in English, Hungarian, and German.

#### Scenario: Recipe name translation in German
- **WHEN** viewing the recipe catalog in German
- **THEN** recipe names are displayed in German (e.g., "Pizzateig" instead of "Pizza Dough")

#### Scenario: Ingredient translation in German
- **WHEN** viewing a recipe detail in German
- **THEN** ingredient names are displayed in German (e.g., "Wasser" instead of "Water")

#### Scenario: Instruction translation in German
- **WHEN** viewing a static recipe in German
- **THEN** all preparation instructions are displayed in German
