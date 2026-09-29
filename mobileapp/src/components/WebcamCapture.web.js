import { useEffect, useRef } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useI18n } from '../context/I18nContext';
import { showMessage } from '../platform/dialogs';
import { Icon } from './Icon';

const JPEG_QUALITY = 0.8;

// The browser camera for note photos (the web image picker only opens files).
// Hands back a JPEG data URL. WebcamCapture.js is the empty native twin.
export function WebcamCapture({ visible, onCapture, onClose }) {
  const { t } = useI18n();
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!visible) return undefined;
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
        showMessage(t('notes.permissionDenied'));
        onClose();
      });
    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [visible, onClose, t]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    onCapture(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
  };

  if (!visible) return null;

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <video ref={videoRef} autoPlay playsInline style={VIDEO_STYLE} />
        <View style={styles.controls}>
          <Pressable
            style={({ pressed }) => [styles.captureButton, pressed && styles.pressed]}
            onPress={handleCapture}
            accessibilityRole="button"
            accessibilityLabel={t('notes.camera')}
          >
            <Icon name="camera" size={32} color={colors.black} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            onPress={onClose}
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>{t('notes.cancel')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// A raw DOM element takes CSS, not a React Native style.
const VIDEO_STYLE = { width: '100%', maxHeight: '70%', objectFit: 'contain' };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.onPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.overlayLight,
    borderRadius: 8,
  },
  closeButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontFamily: fonts.regular,
  },
});
