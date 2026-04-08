import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import { AuthSessionProvider } from "@/src/providers/AuthSessionProvider";
import { useAuthSession } from "@/src/hooks/useAuthSession";
import { tokens } from "@/src/theme/tokens";

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const { isHydrating, isAuthenticated } = useAuthSession();

  useEffect(() => {
    if (isHydrating) {
      return;
    }

    const firstSegment = segments[0];
    const inAuthGroup = firstSegment === "(auth)";
    const inPrivateGroup = firstSegment === "(private)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/admin");
      return;
    }

    if (isAuthenticated && !inPrivateGroup) {
      router.replace("/(private)/(tabs)/messages");
    }
  }, [isAuthenticated, isHydrating, router, segments]);

  if (isHydrating) {
    return (
      <View style={styles.bootContainer}>
        <ActivityIndicator color={tokens.colors.accent} size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Chalet: require("../assets/Chalet-NewYorkSixty.otf")
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.bootContainer}>
        <ActivityIndicator color={tokens.colors.accent} size="large" />
      </View>
    );
  }

  return (
    <AuthSessionProvider>
      <AuthGate />
    </AuthSessionProvider>
  );
}

const styles = StyleSheet.create({
  bootContainer: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    alignItems: "center",
    justifyContent: "center"
  }
});
