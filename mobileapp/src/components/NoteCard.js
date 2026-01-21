import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { useI18n } from '../context/I18nContext';

export function NoteCard({ note, onPress, onPhotoPress }) {
  const { t } = useI18n();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isEdited = note.updatedAt > note.createdAt;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.date}>
          {formatDate(note.createdAt)}
          {isEdited && <Text style={styles.edited}> ({t('notes.edited')})</Text>}
        </Text>
      </View>
      
      <Text style={styles.text} numberOfLines={3}>
        {note.text}
      </Text>
      
      {note.photos && note.photos.length > 0 && (
        <View style={styles.photosRow}>
          {note.photos.map((uri, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onPhotoPress && onPhotoPress(uri)}
              activeOpacity={0.8}
            >
              <Image source={{ uri }} style={styles.thumbnail} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  edited: {
    fontStyle: 'italic',
  },
  text: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  photosRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: colors.border,
  },
});
