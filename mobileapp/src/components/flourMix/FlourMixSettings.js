import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { useI18n } from '../../context/I18nContext';
import {
  FLOUR_KEYS,
  STARCH_KEYS,
  STYLE_KEYS,
  TANGZHONG_PERCENT_MIN,
  TANGZHONG_PERCENT_MAX,
  styleRatioLabel,
} from '../../utils/flourMixCalculator';
import { toggleInList } from '../../utils/stepper';
import { Card } from '../Card';
import { CategoryTitle, Hint } from '../Typography';
import { ChoiceGrid } from '../ChoiceGrid';
import { ChipGroup } from '../Chip';
import { SwitchRow } from '../SwitchRow';
import { SegmentedControl } from '../SegmentedControl';

// The sorghum unimix sits among the flour chips but is its own setting: the solver
// takes it apart instead of weighing it as a flour.
const UNIMIX_KEY = 'unimix';

const TANGZHONG_PERCENT_CHOICES = Array.from(
  { length: TANGZHONG_PERCENT_MAX - TANGZHONG_PERCENT_MIN + 1 },
  (_, index) => TANGZHONG_PERCENT_MIN + index
);

// The target style and the cupboard. `settings` is the screen's settings object;
// `onChange(key, value)` sets one field of it.
export function FlourMixSettings({ settings, onChange }) {
  const { t } = useI18n();
  const shortNames = (keys) => keys.map((key) => ({ key, label: t(`flourMix.short.${key}`) }));

  return (
    <>
      <Card style={styles.card}>
        <CategoryTitle>{t('flourMix.styleTitle')}</CategoryTitle>
        <ChoiceGrid
          options={STYLE_KEYS.map((key) => ({ key, label: t(`flourMix.styles.${key}`) }))}
          value={settings.style}
          onChange={(value) => onChange('style', value)}
        />
        <Hint>{t('flourMix.styleHint', { ratio: styleRatioLabel(settings.style) })}</Hint>
        {settings.style === 'enrichedBun' && <Hint>{t('flourMix.enrichedBunHint')}</Hint>}
      </Card>

      <Card style={styles.card}>
        <CategoryTitle>{t('flourMix.cupboardTitle')}</CategoryTitle>
        <View style={styles.firstGroup}>
          <Text style={styles.groupLabel}>{t('flourMix.floursLabel')}</Text>
          <ChipGroup
            options={shortNames([UNIMIX_KEY, ...FLOUR_KEYS])}
            selected={settings.unimix ? [UNIMIX_KEY, ...settings.flours] : settings.flours}
            onToggle={(key) =>
              key === UNIMIX_KEY
                ? onChange('unimix', !settings.unimix)
                : onChange('flours', toggleInList(settings.flours, key))
            }
          />
          {settings.unimix && <Hint>{t('flourMix.unimixHint')}</Hint>}
        </View>

        <View style={styles.group}>
          <Text style={styles.groupLabel}>{t('flourMix.starchesLabel')}</Text>
          <ChipGroup
            options={shortNames(STARCH_KEYS)}
            selected={settings.starches}
            onToggle={(key) => onChange('starches', toggleInList(settings.starches, key))}
          />
        </View>

        <View style={styles.switches}>
          <SwitchRow
            label={t('flourMix.psylliumLabel')}
            hint={t('flourMix.psylliumHint')}
            value={settings.psyllium}
            onValueChange={(value) => onChange('psyllium', value)}
            divider
          />
          <SwitchRow
            label={t('flourMix.tangzhongLabel')}
            hint={t('flourMix.tangzhongHint')}
            value={settings.tangzhong}
            onValueChange={(value) => onChange('tangzhong', value)}
          />
        </View>

        {settings.tangzhong && (
          <View style={styles.group}>
            <Text style={styles.groupLabel}>{t('flourMix.tangzhongShareLabel')}</Text>
            <SegmentedControl
              options={TANGZHONG_PERCENT_CHOICES.map((value) => ({ key: value, label: `${value}%` }))}
              value={settings.tangzhongPercent}
              onChange={(value) => onChange('tangzhongPercent', value)}
            />
            <Hint>{t('flourMix.tangzhongShareHint')}</Hint>
          </View>
        )}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
  firstGroup: {
    marginTop: 4,
    gap: 10,
  },
  group: {
    marginTop: 18,
    gap: 10,
  },
  groupLabel: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textSecondary,
  },
  switches: {
    marginTop: 18,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
