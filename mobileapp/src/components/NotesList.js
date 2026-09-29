import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useI18n } from '../context/I18nContext';
import { Icon } from './Icon';
import { getNotes } from '../utils/notesStorage';
import { NoteCard } from './NoteCard';

export function NotesList({ recipeId, onEditNote, onAddNote, onPhotoPress, refreshTrigger }) {
  const { t } = useI18n();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const recipeNotes = await getNotes(recipeId);
      setNotes(recipeNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes, refreshTrigger]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{t('notes.noNotes')}</Text>
        </View>
      ) : (
        notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onPress={() => onEditNote(note)}
            onPhotoPress={onPhotoPress}
          />
        ))
      )}
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAddNote}
        activeOpacity={0.7}
      >
        <Icon name="plus" size={18} color={colors.onPrimary} strokeWidth={2.4} />
        <Text style={styles.addButtonText}>{t('notes.addNote')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: colors.textSecondary,
    padding: 16,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
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
  addButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontFamily: fonts.semibold,
  },
});
