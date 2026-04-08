import { Pressable, StyleSheet } from "react-native";
import { tokens } from "@/src/theme/tokens";
import { AppText } from "./AppText";

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function SecondaryButton({ label, onPress, disabled = false }: SecondaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <AppText style={styles.text}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: tokens.layout.buttonHeight,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.separator,
    paddingHorizontal: 18
  },
  text: {
    ...tokens.typography.button,
    color: tokens.colors.accent
  },
  pressed: {
    opacity: tokens.opacity.muted
  },
  disabled: {
    opacity: tokens.opacity.disabled
  }
});
