import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
  StyleSheet,
} from 'react-native';
import { colors } from '../constants/colors';
import { useI18n } from '../context/I18nContext';
import {
  calculateFlourMix,
  FLOUR_KEYS,
  STARCH_KEYS,
  STYLE_KEYS,
  FLOUR_MIX_INGREDIENT_KEYS,
} from '../utils/flourMixCalculator';
import { Header } from '../components/Header';
import { FormulaRow } from '../components/FormulaRow';

const STYLE_RATIOS = { sandwich: '65 : 35', rustic: '70 : 30', softRoll: '60 : 40' };
const GROUP_ORDER = ['flour', 'starch', 'psyllium', 'liquid', 'addition'];

const EMOJI = {
  unimix: '🌿',
  sorghum: '🌿',
  brownRice: '🌾',
  millet: '🌱',
  potato: '🥔',
  tapioca: '🥔',
  corn: '🌽',
  psylliumHusk: '🌾',
  water: '💧',
  oil: '🫒',
  salt: '🧂',
  honey: '🍯',
  freshYeast: '🦠',
  vinegar: '🍶',
};

export function FlourMixCalculatorView({ recipe, onBack }) {
  useKeepAwake();
  const { t } = useI18n();

  const batchStep = recipe.stepSize || 50;
  const [batchSize, setBatchSize] = useState(String(recipe.initialValue || 500));
  const [style, setStyle] = useState('sandwich');
  const [unimix, setUnimix] = useState(true);
  const [flours, setFlours] = useState(['brownRice']);
  const [starches, setStarches] = useState(['potato', 'tapioca']);
  const [psyllium, setPsyllium] = useState(true);
  const [tangzhong, setTangzhong] = useState(true);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const formula = useMemo(
    () =>
      calculateFlourMix({
        batchSizeG: batchSize,
        unimixAvailable: unimix,
        floursAvailable: flours,
        starchesAvailable: starches,
        psylliumAvailable: psyllium,
        tangzhong,
        targetStyle: style,
      }),
    [batchSize, unimix, flours, starches, psyllium, tangzhong, style]
  );

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 100, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [formula]);

  const handleIncrement = () => {
    const current = parseInt(batchSize, 10) || 0;
    setBatchSize(String(current + batchStep));
  };

  const handleDecrement = () => {
    const current = parseInt(batchSize, 10) || 0;
    if (current > batchStep) {
      setBatchSize(String(current - batchStep));
    }
  };

  const toggleInList = (list, setList, key) => {
    setList(list.indexOf(key) === -1 ? list.concat(key) : list.filter((item) => item !== key));
  };

  // The calculator returns notes as keys plus params so they stay translatable.
  const formatNote = (note) => {
    let text = t(`flourMix.notes.${note.key}`);
    if (note.ingredientKey) {
      text = text.split('{ingredient}').join(t(note.ingredientKey));
    }
    if (note.params) {
      Object.keys(note.params).forEach((param) => {
        text = text.split(`{${param}}`).join(note.params[param]);
      });
    }
    return text;
  };

  const nameOf = (key) => t(FLOUR_MIX_INGREDIENT_KEYS[key] || key);
  const shortNameOf = (key) => t(`flourMix.short.${key}`);

  const animatedStyle = { opacity: fadeAnim, transform: [{ scale: scaleAnim }] };

  const renderChip = (label, active, onPress) => (
    <TouchableOpacity
      key={label}
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {active && <Text style={styles.chipCheck}>✓</Text>}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderSwitchRow = (label, hint, value, onValueChange, last) => (
    <TouchableOpacity
      style={[styles.switchRow, last && styles.switchRowLast]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
    >
      <View style={styles.switchLabels}>
        <Text style={styles.switchLabel}>{label}</Text>
        {!!hint && <Text style={styles.switchHint}>{hint}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#fff"
        ios_backgroundColor={colors.border}
      />
    </TouchableOpacity>
  );

  const renderBar = (percent, fill) => (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${Math.max(0, Math.min(100, percent))}%`, backgroundColor: fill }]} />
    </View>
  );

  const renderFractionRows = (rows, capInfo) =>
    rows.map((row) => {
      const info = capInfo[row.key];
      return (
        <View key={row.key} style={styles.fractionRow}>
          <View style={styles.fractionHeader}>
            <Text style={styles.fractionName}>
              {nameOf(row.key)}
              {row.fromMix > 0 ? ` · ${t('flourMix.fromMix')}` : ''}
            </Text>
            <View style={styles.fractionValues}>
              <Text style={styles.fractionAmount}>{row.amount} g</Text>
              <Text style={styles.fractionPercent}>{Math.round(row.percent)}%</Text>
            </View>
          </View>
          {renderBar(row.percent, info && info.over ? colors.accent : colors.primary)}
          {!!info && <Text style={styles.fractionHint}>{info.hint}</Text>}
        </View>
      );
    });

  const bandLabel = () => {
    if (!formula.inBand) return t('flourMix.bandOutside');
    if (formula.onStyleTarget) {
      return t('flourMix.bandOnTarget').split('{style}').join(t(`flourMix.styles.${formula.style}`));
    }
    return t('flourMix.bandInside').split('{style}').join(t(`flourMix.styles.${formula.style}`));
  };

  // Short annotations under the breakdown bars. The reasoning lives in the
  // notes at the bottom, so these stay terse and never repeat that text.
  const capInfoFor = (result) => {
    const info = {};
    const hint = (key, params) => {
      let text = t(`flourMix.capHints.${key}`);
      Object.keys(params || {}).forEach((param) => {
        text = text.split(`{${param}}`).join(params[param]);
      });
      return text;
    };
    result.relaxedCaps.forEach((entry) => {
      info[entry.key] = {
        over: true,
        hint: hint('overCap', { excess: entry.excess, cap: entry.cap }),
      };
    });
    if (result.flags.potatoAtCap && !info.potato) {
      info.potato = { over: false, hint: hint('potatoHeld', { cap: 45 }) };
    }
    if (result.flags.milletCapped && !info.millet) {
      info.millet = { over: false, hint: hint('milletHeld', { cap: 35 }) };
    }
    if (result.flags.brownRiceRest && !info.brownRice) {
      info.brownRice = { over: false, hint: hint('brownRiceRest') };
    }
    return info;
  };

  const capInfo = formula && !formula.error ? capInfoFor(formula) : {};

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <StatusBar style="dark" />

        <Header title={t(recipe.nameKey)} onBack={onBack} />

        <View style={styles.recipeHeader}>
          <Text style={styles.recipeHeaderIcon}>{recipe.icon}</Text>
          <Text style={styles.recipeHeaderSubtitle}>{t('flourMix.subtitle')}</Text>
        </View>

        {/* Batch size */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>{t('flourMix.batchLabel')}</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.button} onPress={handleDecrement} activeOpacity={0.7}>
              <Text style={styles.buttonText}>−</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={batchSize}
              onChangeText={setBatchSize}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity style={styles.button} onPress={handleIncrement} activeOpacity={0.7}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Target style */}
        <View style={styles.optionCard}>
          <Text style={styles.categoryTitle}>{t('flourMix.styleTitle')}</Text>
          <View style={styles.chipRow}>
            {STYLE_KEYS.map((key) =>
              renderChip(t(`flourMix.styles.${key}`), style === key, () => setStyle(key))
            )}
          </View>
          <Text style={styles.cardHint}>
            {t('flourMix.styleHint').split('{ratio}').join(STYLE_RATIOS[style])}
          </Text>
        </View>

        {/* Cupboard */}
        <View style={styles.optionCard}>
          <Text style={styles.categoryTitle}>{t('flourMix.cupboardTitle')}</Text>

          {renderSwitchRow(
            t('flourMix.unimixLabel'),
            t('flourMix.unimixHint'),
            unimix,
            setUnimix
          )}

          <View style={styles.optionGroup}>
            <Text style={styles.groupLabel}>{t('flourMix.floursLabel')}</Text>
            <View style={styles.chipRow}>
              {FLOUR_KEYS.map((key) =>
                renderChip(shortNameOf(key), flours.indexOf(key) !== -1, () =>
                  toggleInList(flours, setFlours, key)
                )
              )}
            </View>
          </View>

          <View style={styles.optionGroup}>
            <Text style={styles.groupLabel}>{t('flourMix.starchesLabel')}</Text>
            <View style={styles.chipRow}>
              {STARCH_KEYS.map((key) =>
                renderChip(shortNameOf(key), starches.indexOf(key) !== -1, () =>
                  toggleInList(starches, setStarches, key)
                )
              )}
            </View>
          </View>

          {renderSwitchRow(
            t('flourMix.psylliumLabel'),
            t('flourMix.psylliumHint'),
            psyllium,
            setPsyllium
          )}
          {renderSwitchRow(
            t('flourMix.tangzhongLabel'),
            t('flourMix.tangzhongHint'),
            tangzhong,
            setTangzhong,
            true
          )}
        </View>

        {!!formula && formula.error === 'noFlourSource' && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🌾</Text>
            <Text style={styles.emptyTitle}>{t('flourMix.noFlourTitle')}</Text>
            <Text style={styles.emptyBody}>{t('flourMix.noFlourBody')}</Text>
          </View>
        )}

        {!!formula && !formula.error && (
          <>
            {/* Summary */}
            <Animated.View style={[styles.summaryBox, animatedStyle]}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>{t('flourMix.summaryRatio')}</Text>
                  <Text style={styles.summaryValue}>
                    {formula.flourPercent}:{formula.starchPercent}
                  </Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>{t('flourMix.summaryHydration')}</Text>
                  <Text style={styles.summaryValue}>{Math.round(formula.hydration)}%</Text>
                </View>
              </View>
            </Animated.View>

            {/* Percentage table */}
            <Animated.View style={[styles.section, animatedStyle]}>
              <Text style={styles.sectionTitle}>{t('flourMix.percentTitle')}</Text>
              <Text style={styles.sectionHint}>
                {t('flourMix.percentHint').split('{base}').join(formula.base)}
              </Text>
              {GROUP_ORDER.map((group) => {
                const rows = formula.weighed.filter((row) => row.group === group);
                if (rows.length === 0) return null;
                return (
                  <View key={group} style={styles.ingredientCard}>
                    <Text style={styles.categoryTitle}>{t(`flourMix.groups.${group}`)}</Text>
                    {rows.map((row) => (
                      <FormulaRow
                        key={row.key}
                        name={nameOf(row.key)}
                        percent={row.percent}
                        amount={row.amount}
                        unit={row.unit || 'g'}
                        emoji={EMOJI[row.key]}
                      />
                    ))}
                    {group === 'addition' && (
                      <Text style={styles.cardHint}>
                        {t('flourMix.dryYeastHint').split('{amount}').join(formula.dryYeast)}
                      </Text>
                    )}
                  </View>
                );
              })}
            </Animated.View>

            {/* Water */}
            <Animated.View style={[styles.section, animatedStyle]}>
              <Text style={styles.sectionTitle}>{t('flourMix.waterTitle')}</Text>
              <View style={styles.ingredientCard}>
                <View style={styles.waterTotalRow}>
                  <Text style={styles.waterTotalLabel}>{t('flourMix.waterTotal')}</Text>
                  <View style={styles.fractionValues}>
                    <Text style={styles.fractionPercent}>{Math.round(formula.hydration)}%</Text>
                    <Text style={styles.waterTotalValue}>{formula.water.total}ml</Text>
                  </View>
                </View>
                {formula.water.tangzhong > 0 && (
                  <FormulaRow
                    name={t('flourMix.streamTangzhong')}
                    hint={t('flourMix.streamTangzhongHint')
                      .split('{amount}')
                      .join(formula.tangzhong.flourTotal)
                      .split('{ingredient}')
                      .join(nameOf(formula.tangzhong.flour[0].key))}
                    amount={formula.water.tangzhong}
                    unit="ml"
                    emoji="🍜"
                  />
                )}
                {formula.water.psylliumGel > 0 && (
                  <FormulaRow
                    name={t('flourMix.streamGel')}
                    hint={t('flourMix.streamGelHint')
                      .split('{ratio}')
                      .join(formula.water.gelRatio)
                      .split('{amount}')
                      .join(formula.psyllium.total)}
                    amount={formula.water.psylliumGel}
                    unit="ml"
                    emoji="🌾"
                  />
                )}
                <FormulaRow
                  name={t('flourMix.streamRemainder')}
                  hint={t('flourMix.streamRemainderHint')}
                  amount={formula.water.remainder}
                  unit="ml"
                  emoji="💧"
                />
              </View>
            </Animated.View>

            {/* Breakdown */}
            <Animated.View style={[styles.section, animatedStyle]}>
              <Text style={styles.sectionTitle}>{t('flourMix.breakdownTitle')}</Text>

              <View style={styles.ingredientCard}>
                <Text style={styles.categoryTitle}>{t('flourMix.ratioTitle')}</Text>
                <View style={styles.splitTrack}>
                  <View style={[styles.splitSegment, { flex: Math.max(formula.flourPercent, 1), backgroundColor: colors.primary }]} />
                  <View style={[styles.splitSegment, { flex: Math.max(formula.starchPercent, 0.0001), backgroundColor: colors.accent }]} />
                </View>
                <View style={styles.splitLabels}>
                  <View>
                    <Text style={styles.splitPercent}>
                      {t('flourMix.flourPercentLabel').split('{percent}').join(formula.flourPercent)}
                    </Text>
                    <Text style={styles.splitGrams}>{formula.flourTotal} g</Text>
                  </View>
                  <View style={styles.splitRight}>
                    <Text style={styles.splitPercent}>
                      {t('flourMix.starchPercentLabel').split('{percent}').join(formula.starchPercent)}
                    </Text>
                    <Text style={styles.splitGrams}>{formula.starchTotal} g</Text>
                  </View>
                </View>
                <Text style={styles.cardHint}>{bandLabel()}</Text>
              </View>

              {formula.flourBreakdown.length > 0 && (
                <View style={styles.ingredientCard}>
                  <Text style={styles.categoryTitle}>{t('flourMix.insideFlour')}</Text>
                  {renderFractionRows(formula.flourBreakdown, capInfo)}
                </View>
              )}

              {formula.starchBreakdown.length > 0 && (
                <View style={styles.ingredientCard}>
                  <Text style={styles.categoryTitle}>{t('flourMix.insideStarch')}</Text>
                  {renderFractionRows(formula.starchBreakdown, capInfo)}
                </View>
              )}

              <View style={styles.ingredientCard}>
                <Text style={styles.categoryTitle}>{t('flourMix.psylliumTitle')}</Text>
                <View style={styles.waterTotalRow}>
                  <Text style={styles.psylliumTotal}>
                    {t('flourMix.psylliumTotalLabel').split('{amount}').join(formula.psyllium.total)}
                  </Text>
                  <Text style={styles.psylliumPercent}>
                    {t('flourMix.psylliumOfBase').split('{percent}').join(formula.psyllium.percent)}
                  </Text>
                </View>
                <View style={styles.splitTrack}>
                  <View
                    style={[
                      styles.splitSegment,
                      { flex: Math.max(formula.psyllium.fromMix, 0.0001), backgroundColor: colors.primary },
                    ]}
                  />
                  <View
                    style={[
                      styles.splitSegment,
                      { flex: Math.max(formula.psyllium.added, 0.0001), backgroundColor: colors.secondary },
                    ]}
                  />
                </View>
                <View style={styles.splitLabels}>
                  <Text style={styles.splitGrams}>
                    {t('flourMix.psylliumFromMix').split('{amount}').join(formula.psyllium.fromMix)}
                  </Text>
                  <Text style={styles.splitGrams}>
                    {t('flourMix.psylliumAdded').split('{amount}').join(formula.psyllium.added)}
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Notes */}
            {formula.notes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('flourMix.notesTitle')}</Text>
                <View style={styles.ingredientCard}>
                  {formula.notes.map((note, index) => (
                    <View key={`${note.key}-${index}`} style={styles.noteRow}>
                      <View style={styles.noteDot} />
                      <Text style={styles.noteText}>{formatNote(note)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  recipeHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  recipeHeaderIcon: {
    fontSize: 80,
    marginBottom: 8,
  },
  recipeHeaderSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    width: 100,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  optionGroup: {
    marginTop: 20,
    gap: 8,
  },
  groupLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipCheck: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  chipTextActive: {
    color: '#fff',
  },
  cardHint: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 14,
    marginTop: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  switchRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  switchLabels: {
    flex: 1,
    gap: 3,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  switchHint: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  summaryBox: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 2,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: -6,
    marginBottom: 12,
  },
  ingredientCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  waterTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  waterTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  waterTotalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  fractionRow: {
    gap: 6,
    marginBottom: 16,
  },
  fractionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
  },
  fractionName: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  fractionValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  fractionAmount: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  fractionPercent: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  fractionHint: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  splitTrack: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  splitSegment: {
    height: 12,
  },
  splitLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  splitRight: {
    alignItems: 'flex-end',
  },
  splitPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  splitGrams: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  psylliumTotal: {
    fontSize: 16,
    color: colors.text,
  },
  psylliumPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  noteDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
});
