import { useState, useCallback } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useI18n } from '../context/I18nContext';
import { showMessage } from '../platform/dialogs';
import { Icon } from './Icon';
import { BottomSheet } from './BottomSheet';
import { WebcamCapture } from './WebcamCapture';

const MAX_PHOTOS = 3;
const PICKER_OPTIONS = { mediaTypes: ['images'], allowsEditing: true, quality: 0.8, exif: false };

async function hasPermission(source) {
  const request =
    source === 'camera'
      ? ImagePicker.requestCameraPermissionsAsync
      : ImagePicker.requestMediaLibraryPermissionsAsync;
  const { status } = await request();
  return status === 'granted';
}

// Up to three photos for a note, from the camera or the library.
export function PhotoPicker({ photos = [], onPhotosChange, disabled = false }) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const [sourceSheetVisible, setSourceSheetVisible] = useState(false);
  const [webcamVisible, setWebcamVisible] = useState(false);

  const canAddPhoto = photos.length < MAX_PHOTOS && !disabled;
  const addPhoto = (uri) => onPhotosChange(photos.concat(uri));

  const pickImage = async (source) => {
    if (!(await hasPermission(source))) {
      showMessage(t('notes.permissionDenied'));
      return;
    }
    setBusy(true);
    try {
      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
          : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
      if (!result.canceled && result.assets && result.assets[0]) {
        addPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setBusy(false);
    }
  };

  const handleSource = (source) => {
    setSourceSheetVisible(false);
    // The web image picker cannot open a camera, so the browser one takes over.
    if (source === 'camera' && Platform.OS === 'web') {
      setWebcamVisible(true);
    } else {
      pickImage(source);
    }
  };

  const handleWebcamCapture = (dataUrl) => {
    addPhoto(dataUrl);
    setWebcamVisible(false);
  };

  const closeWebcam = useCallback(() => setWebcamVisible(false), []);

  return (
    <View style={styles.container}>
      <View style={styles.photosRow}>
        {photos.map((uri, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri }} style={styles.photo} />
            <Pressable
              style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}
              onPress={() => onPhotosChange(photos.filter((_, i) => i !== index))}
              disabled={disabled}
              accessibilityRole="button"
              hitSlop={10}
            >
              <Icon name="close" size={12} color={colors.onPrimary} strokeWidth={3} />
            </Pressable>
          </View>
        ))}

        {canAddPhoto && (
          <Pressable
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
            onPress={() => setSourceSheetVisible(true)}
            disabled={busy}
            accessibilityRole="button"
          >
            <Icon name="camera" size={20} color={colors.textSecondary} />
            <Text style={styles.addButtonText}>{t('notes.addPhoto')}</Text>
          </Pressable>
        )}
      </View>

      {photos.length >= MAX_PHOTOS && <Text style={styles.limitText}>{t('notes.photoLimitReached')}</Text>}

      <BottomSheet
        visible={sourceSheetVisible}
        title={t('notes.addPhoto')}
        options={[
          { key: 'camera', label: t('notes.camera') },
          { key: 'library', label: t('notes.gallery') },
        ]}
        onSelect={handleSource}
        onClose={() => setSourceSheetVisible(false)}
      />
      <WebcamCapture visible={webcamVisible} onCapture={handleWebcamCapture} onClose={closeWebcam} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  photosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  addButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  addButtonText: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  limitText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
