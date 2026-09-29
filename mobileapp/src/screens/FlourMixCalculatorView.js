import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
  StyleSheet,
} from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useI18n } from '../context/I18nContext';
import {
  calculateFlourMix,
  FLOUR_KEYS,
  STARCH_KEYS,
  STYLE_KEYS,
  FLOUR_MIX_INGREDIENT_KEYS,
  TANGZHONG_PERCENT_MIN,
  TANGZHONG_PERCENT_MAX,
  TANGZHONG_PERCENT_DEFAULT,
} from '../utils/flourMixCalculator';
import { Header } from '../components/Header';
import { Icon } from '../components/Icon';
import { RecipeHero } from '../components/RecipeHero';
import { Stepper } from '../components/Stepper';
import { StartCookingBar } from '../components/StartCookingBar';
import { FormulaRow } from '../components/FormulaRow';
import { NotesList } from '../components/NotesList';
import { NoteEditor } from '../components/NoteEditor';
import { PhotoPreview } from '../components/PhotoPreview';
import { buildFlourMixPlan } from '../utils/flourMixSteps';

const STYLE_RATIOS = {
  sandwich: '65 : 35',
  rustic: '70 : 30',
  softRoll: '60 : 40',
  enrichedBun: '60 : 40',
};
const GROUP_ORDER = ['flour', 'starch', 'psyllium', 'liquid', 'addition'];


const TANGZHONG_PERCENT_CHOICES = Array.from(
  { length: TANGZHONG_PERCENT_MAX - TANGZHONG_PERCENT_MIN + 1 },
  (_, index) => TANGZHONG_PERCENT_MIN + index
);

// The last settings, so that coming back from cooking mode (which remounts this
// screen) does not reset the cupboard. Kept for the app session only.
let savedSettings = null;

export function FlourMixCalculatorView({ recipe, onBack, onStartCooking }) {
  useKeepAwake();
  const { t } = useI18n();

  const saved = savedSettings || {};
  const batchStep = recipe.stepSize || 50;
  const [batchSize, setBatchSize] = useState(saved.batchSize || String(recipe.initialValue || 500));
  const [style, setStyle] = useState(saved.style || 'sandwich');
  const [unimix, setUnimix] = useState(saved.unimix !== undefined ? saved.unimix : true);
  const [flours, setFlours] = useState(saved.flours || ['brownRice']);
  const [starches, setStarches] = useState(saved.starches || ['potato', 'tapioca']);
  const [psyllium, setPsyllium] = useState(saved.psyllium !== undefined ? saved.psyllium : true);
  const [tangzhong, setTangzhong] = useState(saved.tangzhong !== undefined ? saved.tangzhong : true);
  const [tangzhongPercent, setTangzhongPercent] = useState(
    saved.tangzhongPercent || TANGZHONG_PERCENT_DEFAULT
  );

  useEffect(() => {
    savedSettings = { batchSize, style, unimix, flours, starches, psyllium, tangzhong, tangzhongPercent };
  }, [batchSize, style, unimix, flours, starches, psyllium, tangzhong, tangzhongPercent]);

  // Notes state
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [noteEditorVisible, setNoteEditorVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [notesRefreshTrigger, setNotesRefreshTrigger] = useState(0);
  const [previewPhoto, setPreviewPhoto] = useState(null);

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
        tangzhongPercent,
        targetStyle: style,
      }),
    [batchSize, unimix, flours, starches, psyllium, tangzhong, tangzhongPercent, style]
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
      {active && <Icon name="check" size={16} color={colors.primaryOnSoft} strokeWidth={2.6} />}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderStyleOption = (key) => {
    const active = style === key;
    return (
      <TouchableOpacity
        key={key}
        style={[styles.styleOption, active && styles.styleOptionActive]}
        onPress={() => setStyle(key)}
        activeOpacity={0.7}
      >
        {active && <Icon name="check" size={18} color={colors.onInverse} strokeWidth={2.4} />}
        <Text style={[styles.styleOptionText, active && styles.styleOptionTextActive]}>
          {t(`flourMix.styles.${key}`)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSegment = (value) => {
    const active = tangzhongPercent === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.segment, active && styles.segmentActive]}
        onPress={() => setTangzhongPercent(value)}
        activeOpacity={0.7}
      >
        <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{value}%</Text>
      </TouchableOpacity>
    );
  };

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
        thumbColor={colors.surface}
        // react-native-web colours the on-state thumb separately (teal by default)
        activeThumbColor={colors.surface}
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
          {renderBar(row.percent, info && info.over ? colors.warning : colors.primary)}
          {!!info && (
            <Text style={[styles.fractionHint, info.over && styles.fractionHintOver]}>{info.hint}</Text>
          )}
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
  const milkLiquid = !!formula && !formula.error && formula.water.liquid === 'milk';

  const canCook = !!onStartCooking && !!formula && !formula.error;

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <StatusBar style="dark" />

          <Header onBack={onBack} />

          <RecipeHero
            image={recipe.image}
            title={t(recipe.nameKey)}
            subtitle={t(recipe.descriptionKey)}
          />

          <Stepper
            label={t('flourMix.batchLabel')}
            value={batchSize}
            onChangeText={setBatchSize}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />

          {/* Target style */}
          <View style={styles.optionCard}>
            <Text style={styles.categoryTitle}>{t('flourMix.styleTitle')}</Text>
            <View style={styles.styleGrid}>{STYLE_KEYS.map(renderStyleOption)}</View>
            <Text style={styles.cardHint}>
              {t('flourMix.styleHint').split('{ratio}').join(STYLE_RATIOS[style])}
            </Text>
            {style === 'enrichedBun' && (
              <Text style={styles.cardHint}>{t('flourMix.enrichedBunHint')}</Text>
            )}
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
              !tangzhong
            )}
            {tangzhong && (
              <View style={styles.tangzhongShareRow}>
                <Text style={styles.switchHint}>{t('flourMix.tangzhongShareLabel')}</Text>
                <View style={styles.segmented}>{TANGZHONG_PERCENT_CHOICES.map(renderSegment)}</View>
                <Text style={styles.cardHint}>{t('flourMix.tangzhongShareHint')}</Text>
              </View>
            )}
          </View>

          {!!formula && formula.error === 'noFlourSource' && (
            <View style={styles.emptyCard}>
              <Icon name="loaf" size={48} color={colors.primary} strokeWidth={1.5} />
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
                          unit={row.unit === 'pcs' ? ` ${t('flourMix.eggUnit')}` : row.unit || 'g'}
                        />
                      ))}
                      {group === 'liquid' && formula.water.egg > 0 && (
                        <Text style={styles.cardHint}>
                          {t('flourMix.eggHint').split('{amount}').join(formula.water.egg)}
                        </Text>
                      )}
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
                  {formula.water.liquid === 'milk' && (
                    <Text style={styles.cardHint}>{t('flourMix.waterEquivalentHint')}</Text>
                  )}
                  {formula.water.tangzhong > 0 && (
                    <FormulaRow
                      name={t('flourMix.streamTangzhong')}
                      hint={t(milkLiquid ? 'flourMix.streamTangzhongMilkHint' : 'flourMix.streamTangzhongHint')
                        .split('{amount}')
                        .join(formula.tangzhong.flourTotal)
                        .split('{ingredient}')
                        .join(nameOf(formula.tangzhong.flour[0].key))}
                      amount={formula.water.tangzhong}
                      unit={milkLiquid ? 'g' : 'ml'}
                    />
                  )}
                  {formula.water.egg > 0 && (
                    <FormulaRow
                      name={t('flourMix.streamEgg')}
                      hint={t('flourMix.streamEggHint')}
                      amount={formula.water.eggCount}
                      unit={` ${t('flourMix.eggUnit')}`}
                    />
                  )}
                  {formula.water.psylliumGel > 0 && (
                    <FormulaRow
                      name={t('flourMix.streamGel')}
                      hint={t('flourMix.streamGelHint')
                        .split('{ratio}')
                        .join(formula.water.gelRatio)
                        .split('{amount}')
                        .join(formula.psyllium.added)}
                      amount={formula.water.psylliumGel}
                      unit="ml"
                    />
                  )}
                  <FormulaRow
                    name={t(milkLiquid ? 'flourMix.streamRemainderMilk' : 'flourMix.streamRemainder')}
                    hint={t('flourMix.streamRemainderHint')}
                    amount={formula.water.remainder}
                    unit={milkLiquid ? 'g' : 'ml'}
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
                    <View style={[styles.splitSegment, { flex: Math.max(formula.starchPercent, 0.0001), backgroundColor: colors.chartSecondary }]} />
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
                        { flex: Math.max(formula.psyllium.added, 0.0001), backgroundColor: colors.chartSecondary },
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

          {/* My Notes */}
          <View style={styles.notesSection}>
            <TouchableOpacity
              style={styles.notesSectionHeader}
              onPress={() => setNotesExpanded(!notesExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>{t('notes.title')}</Text>
              <Icon
                name={notesExpanded ? 'chevronDown' : 'chevronRight'}
                size={20}
                color={colors.textSecondary}
                strokeWidth={2}
              />
            </TouchableOpacity>

            {notesExpanded && (
              <NotesList
                recipeId={recipe.id}
                onEditNote={(note) => {
                  setEditingNote(note);
                  setNoteEditorVisible(true);
                }}
                onAddNote={() => {
                  setEditingNote(null);
                  setNoteEditorVisible(true);
                }}
                onPhotoPress={setPreviewPhoto}
                refreshTrigger={notesRefreshTrigger}
              />
            )}
          </View>

          <NoteEditor
            visible={noteEditorVisible}
            note={editingNote}
            recipeId={recipe.id}
            onClose={() => setNoteEditorVisible(false)}
            onSaved={() => setNotesRefreshTrigger((prev) => prev + 1)}
          />

          <PhotoPreview
            visible={!!previewPhoto}
            photoUri={previewPhoto}
            onClose={() => setPreviewPhoto(null)}
          />
        </View>
      </ScrollView>
      {canCook && (
        <StartCookingBar
          label={t('common.startCooking')}
          onPress={() => onStartCooking({ cookingPlan: buildFlourMixPlan(formula, t, nameOf) })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 32,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  optionGroup: {
    marginTop: 18,
    gap: 10,
  },
  groupLabel: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textSecondary,
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  styleOption: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  styleOptionActive: {
    backgroundColor: colors.inverse,
    borderColor: colors.inverse,
  },
  styleOptionText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  styleOptionTextActive: {
    fontFamily: fonts.bold,
    color: colors.onInverse,
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
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    paddingLeft: 12,
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  chipTextActive: {
    fontFamily: fonts.bold,
    color: colors.primaryOnSoft,
  },
  segmented: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
  },
  segment: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 1,
  },
  segmentText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.textSecondary,
  },
  segmentTextActive: {
    fontFamily: fonts.extrabold,
    color: colors.text,
  },
  cardHint: {
    fontSize: 13,
    fontFamily: fonts.regular,
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
    borderBottomColor: colors.divider,
  },
  switchRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  tangzhongShareRow: {
    gap: 10,
    paddingTop: 14,
  },
  switchLabels: {
    flex: 1,
    gap: 3,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  switchHint: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  summaryBox: {
    backgroundColor: colors.inverse,
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    gap: 2,
  },
  summaryDivider: {
    width: 1,
    height: 48,
    marginHorizontal: 16,
    backgroundColor: colors.textSecondary,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.onInverseSecondary,
  },
  summaryValue: {
    fontSize: 34,
    fontFamily: fonts.display,
    color: colors.onInverse,
    fontVariant: ['tabular-nums'],
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: fonts.display,
    color: colors.text,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionHint: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: -4,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  ingredientCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 12,
  },
  waterTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  waterTotalLabel: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  waterTotalValue: {
    fontSize: 22,
    fontFamily: fonts.display,
    color: colors.text,
    fontVariant: ['tabular-nums'],
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
    fontFamily: fonts.regular,
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
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  fractionPercent: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  fractionHint: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  fractionHintOver: {
    fontFamily: fonts.semibold,
    color: colors.warningText,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  splitTrack: {
    flexDirection: 'row',
    gap: 2,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surfaceMuted,
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
    fontFamily: fonts.bold,
    color: colors.text,
  },
  splitGrams: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  psylliumTotal: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  psylliumPercent: {
    fontSize: 16,
    fontFamily: fonts.bold,
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
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  notesSection: {
    marginTop: 24,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    paddingBottom: 6,
  },
  notesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  noteText: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text,
    lineHeight: 22,
  },
});
