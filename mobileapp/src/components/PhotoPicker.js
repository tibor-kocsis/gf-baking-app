import { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Platform, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useI18n } from '../context/I18nContext';
import { Icon } from './Icon';

const MAX_PHOTOS = 3;

// Web Webcam Component
function WebcamCapture({ visible, onCapture, onClose, t }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      Alert.alert(t('notes.permissionDenied'));
      onClose();
    }
  }, [onClose, t]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      stopCamera();
      onCapture(dataUrl);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // Start camera when modal becomes visible
  if (visible && !streamRef.current) {
    startCamera();
  }

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={webcamStyles.container}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          style={webcamStyles.video}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <View style={webcamStyles.controls}>
          <TouchableOpacity style={webcamStyles.captureButton} onPress={capturePhoto}>
            <Icon name="camera" size={32} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity style={webcamStyles.closeButton} onPress={handleClose}>
            <Text style={webcamStyles.closeButtonText}>{t('notes.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const webcamStyles = Platform.OS === 'web' ? {
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    maxHeight: '70%',
    objectFit: 'contain',
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
} : {};

export function PhotoPicker({ photos = [], onPhotosChange, disabled = false }) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [webcamVisible, setWebcamVisible] = useState(false);

  const canAddPhoto = photos.length < MAX_PHOTOS && !disabled;

  const requestPermissions = async (useCamera) => {
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
  };

  const pickImage = async (useCamera) => {
    const hasPermission = await requestPermissions(useCamera);
    if (!hasPermission) {
      Alert.alert(t('notes.permissionDenied'));
      return;
    }

    setLoading(true);
    try {
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        // Compress to max 1024px
        ...(Platform.OS !== 'web' && {
          exif: false,
        }),
      };

      let result;
      if (useCamera) {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        const newPhotos = [...photos, result.assets[0].uri];
        onPhotosChange(newPhotos);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWebcamCapture = (dataUrl) => {
    const newPhotos = [...photos, dataUrl];
    onPhotosChange(newPhotos);
    setWebcamVisible(false);
  };

  const showImagePickerOptions = () => {
    if (Platform.OS === 'web') {
      // On web, show choice between webcam and file picker
      const useWebcam = window.confirm(
        `${t('notes.camera')}?\n\nOK = ${t('notes.camera')}\nCancel = ${t('notes.gallery')}`
      );
      if (useWebcam) {
        setWebcamVisible(true);
      } else {
        pickImage(false);
      }
    } else {
      Alert.alert(
        t('notes.addPhoto'),
        '',
        [
          { text: t('notes.camera'), onPress: () => pickImage(true) },
          { text: t('notes.gallery'), onPress: () => pickImage(false) },
          { text: t('notes.cancel'), style: 'cancel' },
        ]
      );
    }
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' && (
        <WebcamCapture
          visible={webcamVisible}
          onCapture={handleWebcamCapture}
          onClose={() => setWebcamVisible(false)}
          t={t}
        />
      )}
      <View style={styles.photosRow}>
        {photos.map((uri, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePhoto(index)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        {canAddPhoto && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={showImagePickerOptions}
            disabled={loading}
          >
            <Icon name="camera" size={20} color={colors.textSecondary} />
            <Text style={styles.addButtonText}>{t('notes.addPhoto')}</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {photos.length >= MAX_PHOTOS && (
        <Text style={styles.limitText}>{t('notes.photoLimitReached')}</Text>
      )}
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
  removeButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontFamily: fonts.bold,
    lineHeight: 18,
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
