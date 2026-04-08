import { Text, StyleSheet, type StyleProp, type TextStyle } from "react-native";
import { tokens } from "@/src/theme/tokens";

type AppTextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

export function AppText({ children, style, numberOfLines }: AppTextProps) {
  return (
    <Text numberOfLines={numberOfLines} style={[styles.text, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: tokens.colors.textPrimary,
    includeFontPadding: false,
    ...tokens.typography.body
  }
});
