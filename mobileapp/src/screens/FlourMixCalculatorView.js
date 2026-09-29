import { useMemo } from 'react';
import { useI18n } from '../context/I18nContext';
import { useSessionState } from '../hooks/useSessionState';
import { usePulse } from '../hooks/usePulse';
import { calculateFlourMix, TANGZHONG_PERCENT_DEFAULT } from '../utils/flourMixCalculator';
import { buildFlourMixPlan } from '../utils/flourMixSteps';
import { ingredientName, noteText } from '../utils/flourMixPresentation';
import { RecipeScreenLayout } from '../components/RecipeScreenLayout';
import { Stepper } from '../components/Stepper';
import { SummaryCard } from '../components/SummaryCard';
import { Section } from '../components/Section';
import { BulletList } from '../components/BulletList';
import { EmptyState } from '../components/EmptyState';
import { FlourMixSettings } from '../components/flourMix/FlourMixSettings';
import { FormulaSection } from '../components/flourMix/FormulaSection';
import { WaterSection } from '../components/flourMix/WaterSection';
import { BreakdownSection } from '../components/flourMix/BreakdownSection';

// A cupboard most bakers here start from: unimix, brown rice, potato and tapioca.
const defaultSettings = (recipe) => ({
  batchSize: String(recipe.initialValue || 500),
  style: 'sandwich',
  unimix: true,
  flours: ['brownRice'],
  starches: ['potato', 'tapioca'],
  psyllium: true,
  tangzhong: true,
  tangzhongPercent: TANGZHONG_PERCENT_DEFAULT,
});

export function FlourMixCalculatorView({ recipe, onBack, onStartCooking }) {
  const { t } = useI18n();
  const [settings, setSettings] = useSessionState(`recipe:${recipe.id}`, () => defaultSettings(recipe));
  const setSetting = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  const formula = useMemo(
    () =>
      calculateFlourMix({
        batchSizeG: settings.batchSize,
        unimixAvailable: settings.unimix,
        floursAvailable: settings.flours,
        starchesAvailable: settings.starches,
        psylliumAvailable: settings.psyllium,
        tangzhong: settings.tangzhong,
        tangzhongPercent: settings.tangzhongPercent,
        targetStyle: settings.style,
      }),
    [settings]
  );
  const pulse = usePulse(formula);
  const solved = !!formula && !formula.error;

  const handleStartCooking = () =>
    onStartCooking(buildFlourMixPlan(formula, t, (key) => ingredientName(key, t)));

  return (
    <RecipeScreenLayout recipe={recipe} onBack={onBack} onStartCooking={solved ? handleStartCooking : null}>
      <Stepper
        label={t('flourMix.batchLabel')}
        value={settings.batchSize}
        onChange={(value) => setSetting('batchSize', value)}
        step={recipe.stepSize || 50}
      />

      <FlourMixSettings settings={settings} onChange={setSetting} />

      {!!formula && formula.error === 'noFlourSource' && (
        <EmptyState icon="loaf" title={t('flourMix.noFlourTitle')} body={t('flourMix.noFlourBody')} />
      )}

      {solved && (
        <>
          <SummaryCard
            animatedStyle={pulse}
            items={[
              { label: t('flourMix.summaryRatio'), value: `${formula.flourPercent}:${formula.starchPercent}` },
              { label: t('flourMix.summaryHydration'), value: `${Math.round(formula.hydration)}%` },
            ]}
          />
          <FormulaSection formula={formula} animatedStyle={pulse} />
          <WaterSection formula={formula} animatedStyle={pulse} />
          <BreakdownSection formula={formula} animatedStyle={pulse} />
          {formula.notes.length > 0 && (
            <Section title={t('flourMix.notesTitle')}>
              <BulletList items={formula.notes.map((note) => noteText(note, t))} />
            </Section>
          )}
        </>
      )}
    </RecipeScreenLayout>
  );
}
