import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { tokens } from "@/src/theme/tokens";

type AppScreenProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
};

export function AppScreen({ children, style, contentStyle, scroll = false }: AppScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView style={[styles.safeArea, style]}>
        <LinearGradient
          colors={[tokens.colors.authGradientStart as string, tokens.colors.authGradientEnd as string]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.fill}
        >
          <ScrollView contentContainerStyle={[styles.scrollContent, contentStyle]}>{children}</ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <LinearGradient
        colors={[tokens.colors.authGradientStart as string, tokens.colors.authGradientEnd as string]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.fill}
      >
        <View style={[styles.content, contentStyle]}>{children}</View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  },
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background
  },
  content: {
    flex: 1,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    flexGrow: 1
  }
});
