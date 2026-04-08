import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { tokens } from "@/src/theme/tokens";

type ChatComposerProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export function ChatComposer({ value, onChangeText, onSend, disabled = false }: ChatComposerProps) {
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.inputShell}>
          <Feather color={tokens.colors.textTertiary as string} name="smile" size={16} />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Sure ..."
            placeholderTextColor={tokens.colors.inputPlaceholder}
            style={styles.input}
          />
          <Feather color={tokens.colors.textTertiary as string} name="paperclip" size={16} />
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={!canSend}
          onPress={onSend}
          style={({ pressed }) => [styles.sendButton, pressed && styles.pressed, !canSend && styles.disabled]}
        >
          <Feather color={tokens.colors.authButtonText as string} name="send" size={16} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderTopColor: tokens.colors.separator,
    backgroundColor: tokens.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  inputShell: {
    flex: 1,
    minHeight: tokens.layout.inputHeight,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.inputBackground,
    borderWidth: 1,
    borderColor: tokens.colors.separator,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14
  },
  input: {
    flex: 1,
    ...tokens.typography.body,
    color: tokens.colors.inputText,
    paddingVertical: 0,
    textAlignVertical: "center"
  },
  sendButton: {
    width: tokens.layout.buttonHeight,
    height: tokens.layout.buttonHeight,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.accent,
    justifyContent: "center",
    alignItems: "center"
  },
  pressed: {
    opacity: tokens.opacity.muted
  },
  disabled: {
    opacity: tokens.opacity.disabled
  }
});
