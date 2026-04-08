import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { tokens } from "@/src/theme/tokens";
import { AppText } from "./AppText";

type TextFieldProps = TextInputProps & {
  label: string;
  errorText?: string | null;
};

export function TextField({ label, errorText, style, ...props }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <AppText style={styles.label}>{label}</AppText>
      <TextInput
        {...props}
        placeholderTextColor={tokens.colors.inputPlaceholder}
        style={[styles.input, style, !!errorText && styles.inputError]}
      />
      {!!errorText && <AppText style={styles.error}>{errorText}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6
  },
  label: {
    ...tokens.typography.caption,
    color: tokens.colors.textSecondary
  },
  input: {
    minHeight: tokens.layout.inputHeight,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: tokens.colors.separator,
    backgroundColor: tokens.colors.inputBackground,
    color: tokens.colors.inputText,
    paddingHorizontal: 18,
    paddingVertical: 0,
    textAlignVertical: "center",
    ...tokens.typography.body
  },
  inputError: {
    borderColor: tokens.colors.danger
  },
  error: {
    ...tokens.typography.caption,
    color: tokens.colors.danger
  }
});
