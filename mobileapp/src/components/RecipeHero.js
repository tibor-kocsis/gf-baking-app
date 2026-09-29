import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

// Photo, recipe name and one line under it, at the top of a recipe screen.
export function RecipeHero({ image, title, subtitle }) {
  return (
    <View style={styles.hero}>
      <Image source={image} style={styles.photo} accessibilityIgnoresInvertColors />
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
  },
  texts: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontFamily: fonts.displayHeavy,
    color: colors.text,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
});
