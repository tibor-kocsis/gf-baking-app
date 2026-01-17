import { I18nProvider } from './src/context/I18nContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <I18nProvider>
      <AppNavigator />
    </I18nProvider>
  );
}
