import { Pressable, StyleSheet, View } from "react-native";
import { tokens } from "@/src/theme/tokens";
import { AppText } from "./AppText";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, disabled = false }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <View>
        <AppText style={styles.text}>{label}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: tokens.layout.buttonHeight,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.colors.authTextPrimary,
    paddingHorizontal: 18
  },
  text: {
    ...tokens.typography.button,
    color: tokens.colors.authButtonText
  },
  pressed: {
    opacity: tokens.opacity.muted
  },
  disabled: {
    opacity: tokens.opacity.disabled
  }
});
