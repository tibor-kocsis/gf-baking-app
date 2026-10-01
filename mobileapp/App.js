import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nProvider } from './src/context/I18nContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { fontAssets } from './src/constants/fonts';

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  // Fonts are bundled, so this is one frame; on an error fall back to system fonts.
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <I18nProvider>
        <AppNavigator />
      </I18nProvider>
    </SafeAreaProvider>
  );
}
