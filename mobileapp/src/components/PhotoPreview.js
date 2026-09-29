import { Modal, View, Image, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { useI18n } from '../context/I18nContext';
import { Icon } from './Icon';

// A note photo full screen; any tap closes it. Sized with flex rather than the
// window size read once at start-up, so it follows rotation and browser resizes.
export function PhotoPreview({ photoUri, onClose }) {
  const { t } = useI18n();
  if (!photoUri) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Image source={{ uri: photoUri }} style={styles.image} resizeMode="contain" />
        <View style={styles.closeButton} accessibilityRole="button" accessibilityLabel={t('notes.cancel')}>
          <Icon name="close" size={20} color={colors.onPrimary} strokeWidth={2.4} />
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
