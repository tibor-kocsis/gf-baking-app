import { Alert } from 'react-native';

// Native dialogs. dialogs.web.js is the browser twin: react-native-web's Alert
// does nothing, which silently broke note deletion and error messages on web.

export function showMessage(message) {
  Alert.alert(message);
}

// Resolves true when the baker confirms.
export function confirmDestructive({ title, message, confirmLabel, cancelLabel }) {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: cancelLabel, style: 'cancel', onPress: () => resolve(false) },
        { text: confirmLabel, style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
}
