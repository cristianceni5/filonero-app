import { StyleSheet, View } from "react-native";
import { AppScreen } from "@/src/components/layout/AppScreen";
import { AppText } from "@/src/components/ui/AppText";
import { AppTitle } from "@/src/components/ui/AppTitle";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { tokens } from "@/src/theme/tokens";

export default function PlaceholderScreen() {
  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppTitle>Da Implementare</AppTitle>
          <AppText style={styles.subtitle}>Spazio pronto per feature future.</AppText>
        </View>

        <Card>
          <EmptyState
            title="Roadmap in costruzione"
            description="Qui aggiungeremo notifiche, allegati, sicurezza avanzata e altre funzionalita."
          />
        </Card>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: tokens.spacing.md
  },
  header: {
    gap: tokens.spacing.xs
  },
  subtitle: {
    color: tokens.colors.textSecondary
  }
});
