import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { NOTES_STORAGE_KEY } from '../constants/storage';

// Only import FileSystem on native platforms
let FileSystem = null;
let NOTES_DIRECTORY = '';

if (Platform.OS !== 'web') {
  FileSystem = require('expo-file-system/legacy');
  NOTES_DIRECTORY = `${FileSystem.documentDirectory}notes/`;
}

// Ensure notes directory exists (native only)
async function ensureNotesDirectory() {
  if (Platform.OS === 'web' || !FileSystem) return;
  
  const dirInfo = await FileSystem.getInfoAsync(NOTES_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(NOTES_DIRECTORY, { intermediates: true });
  }
}

// Generate a simple UUID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Get all notes data from storage
async function getAllNotesData() {
  try {
    const data = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading notes:', error);
    return {};
  }
}

// Save all notes data to storage
async function saveAllNotesData(data) {
  try {
    await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving notes:', error);
    throw error;
  }
}

/**
 * Get notes for a specific recipe
 * @param {string} recipeId - The recipe ID
 * @returns {Promise<Array>} Array of notes for the recipe
 */
export async function getNotes(recipeId) {
  const allNotes = await getAllNotesData();
  const notes = allNotes[recipeId] || [];
  // Sort by createdAt descending (newest first)
  return notes.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Save a photo to the notes directory
 * @param {string} tempUri - Temporary URI from image picker (or data URL on web)
 * @param {string} noteId - The note ID
 * @param {number} index - Photo index (0-2)
 * @returns {Promise<string>} Permanent file URI or data URL
 */
export async function savePhoto(tempUri, noteId, index) {
  // On web, photos are already data URLs - just return them
  if (Platform.OS === 'web') {
    return tempUri;
  }
  
  // On native, copy to permanent storage
  await ensureNotesDirectory();
  const filename = `${noteId}_${index}.jpg`;
  const permanentUri = `${NOTES_DIRECTORY}${filename}`;
  
  await FileSystem.copyAsync({
    from: tempUri,
    to: permanentUri,
  });
  
  return permanentUri;
}

/**
 * Delete a photo file
 * @param {string} photoUri - The photo URI to delete
 */
export async function deletePhoto(photoUri) {
  // On web, photos are data URLs stored inline - nothing to delete
  if (Platform.OS === 'web') {
    return;
  }
  
  try {
    const fileInfo = await FileSystem.getInfoAsync(photoUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(photoUri);
    }
  } catch (error) {
    console.error('Error deleting photo:', error);
  }
}

/**
 * Save a note (create or update)
 * @param {Object} note - The note object
 * @param {string} note.recipeId - Recipe ID (required)
 * @param {string} [note.id] - Note ID (generated if not provided)
 * @param {string} note.text - Note text content
 * @param {Array<string>} [note.photos] - Array of photo URIs
 * @returns {Promise<Object>} The saved note
 */
export async function saveNote(note) {
  const allNotes = await getAllNotesData();
  const recipeNotes = allNotes[note.recipeId] || [];
  
  const now = Date.now();
  let savedNote;
  
  if (note.id) {
    // Update existing note
    const index = recipeNotes.findIndex(n => n.id === note.id);
    if (index !== -1) {
      savedNote = {
        ...recipeNotes[index],
        text: note.text,
        photos: note.photos || [],
        updatedAt: now,
      };
      recipeNotes[index] = savedNote;
    } else {
      throw new Error('Note not found');
    }
  } else {
    // Create new note
    savedNote = {
      id: generateId(),
      recipeId: note.recipeId,
      text: note.text,
      photos: note.photos || [],
      createdAt: now,
      updatedAt: now,
    };
    recipeNotes.push(savedNote);
  }
  
  allNotes[note.recipeId] = recipeNotes;
  await saveAllNotesData(allNotes);
  
  return savedNote;
}

/**
 * Delete a note and its photos
 * @param {string} noteId - The note ID to delete
 * @param {string} recipeId - The recipe ID
 */
export async function deleteNote(noteId, recipeId) {
  const allNotes = await getAllNotesData();
  const recipeNotes = allNotes[recipeId] || [];
  
  const noteIndex = recipeNotes.findIndex(n => n.id === noteId);
  if (noteIndex === -1) {
    return;
  }
  
  const note = recipeNotes[noteIndex];
  
  // Delete associated photos
  if (note.photos && note.photos.length > 0) {
    await Promise.all(note.photos.map(photoUri => deletePhoto(photoUri)));
  }
  
  // Remove note from array
  recipeNotes.splice(noteIndex, 1);
  allNotes[recipeId] = recipeNotes;
  
  await saveAllNotesData(allNotes);
}

/**
 * Get note count for a recipe
 * @param {string} recipeId - The recipe ID
 * @returns {Promise<number>} Number of notes
 */
export async function getNotesCount(recipeId) {
  const notes = await getNotes(recipeId);
  return notes.length;
}
