import { StyleSheet, type StyleProp, type TextStyle } from "react-native";
import { tokens } from "@/src/theme/tokens";
import { AppText } from "./AppText";

type AppTitleProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export function AppTitle({ children, style }: AppTitleProps) {
  return <AppText style={[styles.title, style]}>{children}</AppText>;
}

const styles = StyleSheet.create({
  title: {
    ...tokens.typography.title,
    color: tokens.colors.textPrimary
  }
});
