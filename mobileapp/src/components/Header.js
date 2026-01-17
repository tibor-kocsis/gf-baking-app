import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export function Header({ title, onBack }) {
  return (
    <View style={styles.headerBar}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
});
