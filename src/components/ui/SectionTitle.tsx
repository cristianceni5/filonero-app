import { StyleSheet, type StyleProp, type TextStyle } from "react-native";
import { tokens } from "@/src/theme/tokens";
import { AppText } from "./AppText";

type SectionTitleProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export function SectionTitle({ children, style }: SectionTitleProps) {
  return <AppText style={[styles.title, style]}>{children}</AppText>;
}

const styles = StyleSheet.create({
  title: {
    ...tokens.typography.section,
    color: tokens.colors.textPrimary
  }
});
