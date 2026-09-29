import AsyncStorage from '@react-native-async-storage/async-storage';
import { NOTES_STORAGE_KEY } from '../constants/storage';
import { persistPhoto, deletePhoto } from '../platform/photoFiles';

// The baker's notes, all recipes in one AsyncStorage entry:
//   { [recipeId]: [{ id, recipeId, text, photos: [uri], createdAt, updatedAt }] }

export function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 11);
}

// Throws rather than returning an empty store: a write built on a failed read
// would replace every recipe's notes with just the one being saved.
async function readAll() {
  const data = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

async function writeAll(data) {
  await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(data));
}

// Newest first.
export async function getNotes(recipeId) {
  const all = await readAll();
  return (all[recipeId] || []).slice().sort((a, b) => b.createdAt - a.createdAt);
}

// Updates the note with this id, or creates it (with this id, if given).
export async function saveNote({ id, recipeId, text, photos = [] }) {
  const all = await readAll();
  const notes = all[recipeId] || [];
  const now = Date.now();
  const index = id ? notes.findIndex((note) => note.id === id) : -1;

  const saved =
    index === -1
      ? { id: id || createId(), recipeId, text, photos, createdAt: now, updatedAt: now }
      : { ...notes[index], text, photos, updatedAt: now };
  all[recipeId] = index === -1 ? notes.concat(saved) : notes.map((note, i) => (i === index ? saved : note));

  await writeAll(all);
  return saved;
}

// Saves a note from the editor: copies newly picked photos into permanent
// storage, and deletes the photos the baker removed only once the note no
// longer points at them. If the save fails, the fresh copies are cleaned up and
// the old note stays intact.
export async function saveNoteWithPhotos({ note, recipeId, text, photos }) {
  const noteId = note ? note.id : createId();
  const previous = note ? note.photos || [] : [];
  const copied = [];
  let saved;

  try {
    const permanent = [];
    for (const uri of photos) {
      if (previous.indexOf(uri) !== -1) {
        permanent.push(uri);
      } else {
        const copy = await persistPhoto(uri, `${noteId}_${createId()}`);
        copied.push(copy);
        permanent.push(copy);
      }
    }
    saved = await saveNote({ id: noteId, recipeId, text, photos: permanent });
  } catch (error) {
    await Promise.all(copied.map(deletePhoto));
    throw error;
  }

  await Promise.all(previous.filter((uri) => photos.indexOf(uri) === -1).map(deletePhoto));
  return saved;
}

// Deletes a note and its photos.
export async function deleteNote(noteId, recipeId) {
  const all = await readAll();
  const notes = all[recipeId] || [];
  const note = notes.find((entry) => entry.id === noteId);
  if (!note) return;

  all[recipeId] = notes.filter((entry) => entry.id !== noteId);
  await writeAll(all);
  await Promise.all((note.photos || []).map(deletePhoto));
}
