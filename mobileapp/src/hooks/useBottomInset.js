import { useSafeAreaInsets } from 'react-native-safe-area-context';

// `base` plus the system navigation bar: the app draws edge to edge on Android, so
// anything pinned or padded at the bottom has to clear the 3-button / gesture bar.
export function useBottomInset(base) {
  return base + useSafeAreaInsets().bottom;
}
