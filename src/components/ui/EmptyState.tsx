import { StyleSheet, View } from "react-native";
import { tokens } from "@/src/theme/tokens";
import { AppText } from "./AppText";
import { SectionTitle } from "./SectionTitle";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <SectionTitle>{title}</SectionTitle>
      <AppText style={styles.description}>{description}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacing.xs,
    paddingVertical: tokens.spacing.xl
  },
  description: {
    color: tokens.colors.textSecondary,
    textAlign: "center"
  }
});
