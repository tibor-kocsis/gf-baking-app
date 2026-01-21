import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../constants/colors';
import { useI18n } from '../context/I18nContext';
import { saveNote, deleteNote, savePhoto, deletePhoto } from '../utils/notesStorage';
import { PhotoPicker } from './PhotoPicker';

export function NoteEditor({ visible, note, recipeId, onClose, onSaved }) {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState([]); // New photos to save

  const isEditing = !!note?.id;

  useEffect(() => {
    if (visible) {
      setText(note?.text || '');
      setPhotos(note?.photos || []);
      setPendingPhotos([]);
    }
  }, [visible, note]);

  const handlePhotosChange = (newPhotos) => {
    // Track which photos are new (not yet saved to file system)
    const existingPhotos = note?.photos || [];
    const newPending = newPhotos.filter(p => !existingPhotos.includes(p));
    setPendingPhotos(newPending);
    setPhotos(newPhotos);
  };

  const handleSave = async () => {
    if (!text.trim()) {
      return;
    }

    setSaving(true);
    try {
      const noteId = note?.id || Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
      
      // Save new photos to permanent storage
      const savedPhotos = [];
      let photoIndex = 0;
      
      for (const photoUri of photos) {
        if (pendingPhotos.includes(photoUri)) {
          // New photo - save to file system
          const permanentUri = await savePhoto(photoUri, noteId, photoIndex);
          savedPhotos.push(permanentUri);
        } else {
          // Existing photo - keep as is
          savedPhotos.push(photoUri);
        }
        photoIndex++;
      }

      // Delete removed photos
      if (note?.photos) {
        for (const oldPhoto of note.photos) {
          if (!photos.includes(oldPhoto)) {
            await deletePhoto(oldPhoto);
          }
        }
      }

      await saveNote({
        id: note?.id,
        recipeId,
        text: text.trim(),
        photos: savedPhotos,
      });

      onSaved();
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('notes.deleteNote'),
      t('notes.confirmDelete'),
      [
        { text: t('notes.cancel'), style: 'cancel' },
        {
          text: t('notes.deleteNote'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(note.id, recipeId);
              onSaved();
              onClose();
            } catch (error) {
              console.error('Error deleting note:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <Text style={styles.cancelText}>{t('notes.cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              {isEditing ? t('notes.editNote') : t('notes.addNote')}
            </Text>
            <TouchableOpacity
              onPress={handleSave}
              style={styles.headerButton}
              disabled={saving || !text.trim()}
            >
              <Text style={[styles.saveText, (!text.trim() || saving) && styles.disabledText]}>
                {t('notes.save')}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
            <TextInput
              style={styles.textInput}
              multiline
              placeholder={t('notes.notePlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={text}
              onChangeText={setText}
              autoFocus
            />

            <PhotoPicker
              photos={photos}
              onPhotosChange={handlePhotosChange}
              disabled={saving}
            />

            {isEditing && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>{t('notes.deleteNote')}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    minWidth: 60,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  cancelText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  saveText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  disabledText: {
    opacity: 0.5,
  },
  content: {
    padding: 16,
  },
  textInput: {
    fontSize: 16,
    color: colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  deleteButton: {
    marginTop: 24,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  deleteButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '500',
  },
});
