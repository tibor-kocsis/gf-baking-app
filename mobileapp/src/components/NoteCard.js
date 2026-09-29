import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useI18n } from '../context/I18nContext';

// Dated in the app's language, not the device's.
function formatDate(timestamp, language) {
  return new Date(timestamp).toLocaleDateString(language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function NoteCard({ note, onPress, onPhotoPress }) {
  const { t, language } = useI18n();
  const isEdited = note.updatedAt > note.createdAt;

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text style={styles.date}>
        {formatDate(note.createdAt, language)}
        {isEdited && <Text style={styles.edited}> ({t('notes.edited')})</Text>}
      </Text>

      <Text style={styles.text} numberOfLines={3}>
        {note.text}
      </Text>

      {note.photos && note.photos.length > 0 && (
        <View style={styles.photosRow}>
          {note.photos.map((uri, index) => (
            <Pressable
              key={index}
              onPress={() => onPhotoPress(uri)}
              style={({ pressed }) => pressed && styles.pressed}
              accessibilityRole="imagebutton"
            >
              <Image source={{ uri }} style={styles.thumbnail} />
            </Pressable>
          ))}
        </View>
      )}
    </Pressable>
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
  pressed: {
    opacity: 0.7,
  },
  date: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  edited: {
    fontStyle: 'italic',
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.regular,
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
