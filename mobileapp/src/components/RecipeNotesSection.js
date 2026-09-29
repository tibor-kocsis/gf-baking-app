import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { pressedStyle } from '../constants/pressed';
import { fonts } from '../constants/fonts';
import { layout } from '../constants/layout';
import { useI18n } from '../context/I18nContext';
import { getNotes } from '../utils/notesStorage';
import { Icon } from './Icon';
import { SectionTitle } from './Typography';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';
import { PhotoPreview } from './PhotoPreview';

// "My notes" under every recipe: collapsed until opened, then the baker's notes
// for this recipe with the editor and photo preview they open.
export function RecipeNotesSection({ recipeId }) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(null);
  const [editor, setEditor] = useState({ visible: false, note: null });
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const loadNotes = useCallback(async () => {
    try {
      setNotes(await getNotes(recipeId));
    } catch (error) {
      console.error('Error loading notes:', error);
      setNotes([]);
    }
  }, [recipeId]);

  useEffect(() => {
    if (expanded) loadNotes();
  }, [expanded, loadNotes]);

  const openEditor = (note) => setEditor({ visible: true, note });
  const closeEditor = useCallback(() => setEditor((current) => ({ ...current, visible: false })), []);

  return (
    <View style={styles.section}>
      <Pressable
        style={({ pressed }) => [styles.header, pressed && pressedStyle]}
        onPress={() => setExpanded(!expanded)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
      >
        <SectionTitle>{t('notes.title')}</SectionTitle>
        <Icon name={expanded ? 'chevronDown' : 'chevronRight'} size={20} color={colors.textSecondary} strokeWidth={2} />
      </Pressable>

      {expanded && (
        <View style={styles.body}>
          {notes && notes.length === 0 && <Text style={styles.emptyText}>{t('notes.noNotes')}</Text>}
          {(notes || []).map((note) => (
            <NoteCard key={note.id} note={note} onPress={() => openEditor(note)} onPhotoPress={setPreviewPhoto} />
          ))}
          <Pressable
            style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
            onPress={() => openEditor(null)}
            accessibilityRole="button"
          >
            <Icon name="plus" size={18} color={colors.onPrimary} strokeWidth={2.4} />
            <Text style={styles.addButtonText}>{t('notes.addNote')}</Text>
          </Pressable>
        </View>
      )}

      <NoteEditor
        visible={editor.visible}
        note={editor.note}
        recipeId={recipeId}
        onClose={closeEditor}
        onSaved={loadNotes}
      />
      <PhotoPreview photoUri={previewPhoto} onClose={() => setPreviewPhoto(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
    backgroundColor: colors.surface,
    borderRadius: layout.cardRadius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    paddingBottom: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: layout.tapTarget,
  },
  body: {
    marginTop: 8,
    paddingBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    padding: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  addButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  addButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontFamily: fonts.semibold,
  },
});
