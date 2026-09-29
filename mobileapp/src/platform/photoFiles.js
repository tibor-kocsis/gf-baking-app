import * as FileSystem from 'expo-file-system/legacy';

// Note photos on the device: copied out of the picker's cache into the app's
// documents, since the cache can be cleared. photoFiles.web.js keeps them inline.
const PHOTO_DIRECTORY = `${FileSystem.documentDirectory}notes/`;

async function ensurePhotoDirectory() {
  const info = await FileSystem.getInfoAsync(PHOTO_DIRECTORY);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(PHOTO_DIRECTORY, { intermediates: true });
  }
}

// `fileId` must be unique per photo: reusing a name would overwrite a photo the
// note still shows.
export async function persistPhoto(tempUri, fileId) {
  await ensurePhotoDirectory();
  const permanentUri = `${PHOTO_DIRECTORY}${fileId}.jpg`;
  await FileSystem.copyAsync({ from: tempUri, to: permanentUri });
  return permanentUri;
}

export async function deletePhoto(photoUri) {
  try {
    const info = await FileSystem.getInfoAsync(photoUri);
    if (info.exists) await FileSystem.deleteAsync(photoUri);
  } catch (error) {
    console.error('Error deleting photo:', error);
  }
}
