import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { pressedStyle } from '../constants/pressed';
import { fonts } from '../constants/fonts';
import { layout } from '../constants/layout';
import { useI18n } from '../context/I18nContext';
import { formatUnit } from '../utils/format';
import { Header } from '../components/Header';
import { Checkbox } from '../components/Checkbox';
import { DurationBadge } from '../components/DurationBadge';
import { MeterBar } from '../components/Meter';

// Step by step at arm's length: large text, big tap targets, screen kept on.
// `plan` is the shared cooking-step shape (see utils/cookingPlan.js), built by
// the recipe screen from the amounts the baker chose.
export function CookingModeView({ title, plan, onBack }) {
  useKeepAwake();
  const { t } = useI18n();
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});

  const steps = plan || [];
  const toggle = (setter, key) => setter((current) => ({ ...current, [key]: !current[key] }));
  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <StatusBar style="dark" />
      <Header title={title} onBack={onBack} />

      <View style={styles.progress}>
        <Text style={styles.progressText}>
          {t('common.stepsCompleted', { completed: completedCount, total: steps.length })}
        </Text>
        <MeterBar percent={steps.length > 0 ? (completedCount / steps.length) * 100 : 0} />
      </View>

      <View style={styles.steps}>
        {steps.map((step, index) => (
          <CookingStep
            key={index}
            number={index + 1}
            step={step}
            completed={!!completedSteps[index]}
            onToggle={() => toggle(setCompletedSteps, index)}
            checkedIngredients={checkedIngredients}
            onToggleIngredient={(id) => toggle(setCheckedIngredients, id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function CookingStep({ number, step, completed, onToggle, checkedIngredients, onToggleIngredient }) {
  const { t } = useI18n();
  const items = step.items || [];

  return (
    <View style={[styles.stepCard, completed && styles.stepCardCompleted]}>
      <Pressable
        style={({ pressed }) => [styles.stepHeader, pressed && pressedStyle]}
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed }}
      >
        <Checkbox checked={completed} round />
        <Text style={[styles.stepNumber, completed && styles.textCompleted]}>
          {t('common.step')} {number}
          {step.title ? ` · ${step.title}` : ''}
        </Text>
      </Pressable>

      <Text style={[styles.instructionText, completed && styles.textCompleted]}>{step.text}</Text>

      {!!step.timerSeconds && (
        <View style={styles.duration}>
          <DurationBadge seconds={step.timerSeconds} large />
        </View>
      )}

      {items.length > 0 && (
        <View style={styles.ingredients}>
          <Text style={[styles.ingredientsTitle, completed && styles.textCompleted]}>
            {t('common.ingredientsForStep')}
          </Text>
          {items.map((item) => {
            const checked = !!checkedIngredients[item.id];
            return (
              <Pressable
                key={item.id}
                style={({ pressed }) => [styles.ingredientRow, pressed && pressedStyle]}
                onPress={() => onToggleIngredient(item.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
              >
                <Checkbox checked={checked} />
                <Text style={[styles.ingredientName, checked && styles.ingredientChecked]}>{item.name}</Text>
                {item.amount !== null && item.amount !== undefined && (
                  <Text style={[styles.ingredientAmount, checked && styles.ingredientChecked]}>
                    {item.amount}
                    {formatUnit(item.unit, t)}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: layout.gutter,
    paddingTop: layout.screenTop,
    paddingBottom: 40,
  },
  progress: {
    marginBottom: 24,
    gap: 8,
  },
  progressText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  steps: {
    gap: 14,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: layout.cardRadius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: layout.cardPadding,
  },
  stepCardCompleted: {
    opacity: 0.6,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: layout.tapTarget,
    marginBottom: 10,
  },
  stepNumber: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.extrabold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  instructionText: {
    fontSize: 20,
    fontFamily: fonts.medium,
    color: colors.text,
    lineHeight: 29,
    marginBottom: 14,
  },
  textCompleted: {
    color: colors.textSecondary,
  },
  duration: {
    marginBottom: 14,
  },
  ingredients: {
    gap: 8,
  },
  ingredientsTitle: {
    fontSize: 13,
    fontFamily: fonts.extrabold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 56,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  ingredientName: {
    flex: 1,
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  ingredientAmount: {
    fontSize: 19,
    fontFamily: fonts.extrabold,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  ingredientChecked: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
});
