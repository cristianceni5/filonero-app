import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { tokens } from "@/src/theme/tokens";

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: tokens.colors.separator,
    ...tokens.shadows.card
  }
});
