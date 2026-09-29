// Browser twin of photoFiles.js: the web has no app file system, so photos
// stay the data URLs the picker or webcam produced, stored inside the note.

export async function persistPhoto(tempUri) {
  return tempUri;
}

export async function deletePhoto() {}
