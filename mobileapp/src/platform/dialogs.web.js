// Browser twin of dialogs.js.

export function showMessage(message) {
  window.alert(message);
}

export function confirmDestructive({ title, message }) {
  return Promise.resolve(window.confirm(message ? `${title}\n\n${message}` : title));
}
