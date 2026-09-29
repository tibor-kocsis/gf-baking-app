import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useI18n } from '../context/I18nContext';
import { saveNoteWithPhotos, deleteNote } from '../utils/notesStorage';
import { showMessage, confirmDestructive } from '../platform/dialogs';
import { PhotoPicker } from './PhotoPicker';

// Add or edit one note. `note` is null for a new one.
export function NoteEditor({ visible, note, recipeId, onClose, onSaved }) {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [busy, setBusy] = useState(false);

  const isEditing = !!note;
  const canSave = !busy && !!text.trim();

  useEffect(() => {
    if (visible) {
      setText(note ? note.text : '');
      setPhotos(note ? note.photos || [] : []);
    }
  }, [visible, note]);

  // Runs a save or delete with the editor locked; on success the list reloads and
  // the sheet closes, on failure the baker sees `failedKey` and keeps their text.
  const runLocked = async (action, failedKey) => {
    setBusy(true);
    try {
      await action();
      onSaved();
      onClose();
    } catch (error) {
      console.error(`Error (${failedKey}):`, error);
      showMessage(t(failedKey));
    } finally {
      setBusy(false);
    }
  };

  const handleSave = () => {
    if (!canSave) return;
    return runLocked(
      () => saveNoteWithPhotos({ note, recipeId, text: text.trim(), photos }),
      'notes.saveFailed'
    );
  };

  const handleDelete = async () => {
    const confirmed = await confirmDestructive({
      title: t('notes.deleteNote'),
      message: t('notes.confirmDelete'),
      confirmLabel: t('notes.deleteNote'),
      cancelLabel: t('notes.cancel'),
    });
    if (!confirmed) return;
    return runLocked(() => deleteNote(note.id, recipeId), 'notes.deleteFailed');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
              accessibilityRole="button"
            >
              <Text style={styles.cancelText}>{t('notes.cancel')}</Text>
            </Pressable>
            <Text style={styles.title}>{isEditing ? t('notes.editNote') : t('notes.addNote')}</Text>
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
              disabled={!canSave}
              accessibilityRole="button"
            >
              <Text style={[styles.saveText, !canSave && styles.disabledText]}>{t('notes.save')}</Text>
            </Pressable>
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

            <PhotoPicker photos={photos} onPhotosChange={setPhotos} disabled={busy} />

            {isEditing && (
              <Pressable
                style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
                onPress={handleDelete}
                disabled={busy}
                accessibilityRole="button"
              >
                <Text style={styles.deleteButtonText}>{t('notes.deleteNote')}</Text>
              </Pressable>
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
    backgroundColor: colors.overlay,
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    minWidth: 60,
    minHeight: 44,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  title: {
    fontSize: 17,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  saveText: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.semibold,
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
    fontFamily: fonts.regular,
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
    borderColor: colors.danger,
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: 16,
    fontFamily: fonts.medium,
  },
});
