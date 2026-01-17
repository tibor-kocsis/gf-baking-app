# i18n Specification

## Purpose
TBD - created by archiving change add-i18n-support. Update Purpose after archive.
## Requirements
### Requirement: Supported Languages
The app SHALL support English and Hungarian languages for all user-facing content.

#### Scenario: English language support
- **WHEN** the user selects English as the language
- **THEN** all UI text, recipe names, descriptions, ingredients, and instructions are displayed in English

#### Scenario: Hungarian language support
- **WHEN** the user selects Hungarian as the language
- **THEN** all UI text, recipe names, descriptions, ingredients, and instructions are displayed in Hungarian

### Requirement: Language Selection UI
The app SHALL provide a language selector on the main catalog screen for users to change the display language.

#### Scenario: Language selector visibility
- **WHEN** the user is on the recipe catalog screen
- **THEN** a language selector is visible at the bottom of the screen
- **AND** the current language is indicated visually

#### Scenario: Changing language
- **WHEN** the user taps on a different language option
- **THEN** the app immediately updates all displayed text to the selected language
- **AND** the language preference is saved for future sessions

### Requirement: Default Language Detection
The app SHALL default to the device's system language when supported, otherwise default to English.

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
- **AND** the device system language is neither English nor Hungarian
- **THEN** the app defaults to English

### Requirement: Language Preference Persistence
The app SHALL persist the user's language preference and restore it on subsequent app launches.

#### Scenario: Language preference saved
- **WHEN** the user changes the language
- **THEN** the preference is stored locally on the device

#### Scenario: Language preference restored
- **WHEN** the app launches
- **AND** the user has previously selected a language
- **THEN** the app uses the saved language preference
- **AND** device locale is not re-detected

### Requirement: Translated Recipe Content
The app SHALL provide translations for all recipe content including names, descriptions, ingredient names, and instructions.

#### Scenario: Recipe name translation
- **WHEN** viewing the recipe catalog in Hungarian
- **THEN** recipe names are displayed in Hungarian (e.g., "Pizza Tészta" instead of "Pizza Dough")

#### Scenario: Ingredient translation
- **WHEN** viewing a recipe detail in Hungarian
- **THEN** ingredient names are displayed in Hungarian (e.g., "Víz" instead of "Water")

#### Scenario: Instruction translation
- **WHEN** viewing a static recipe in Hungarian
- **THEN** all preparation instructions are displayed in Hungarian

