import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, View } from "react-native";
import { Avatar } from "@/src/components/ui/Avatar";
import { AppText } from "@/src/components/ui/AppText";
import { tokens } from "@/src/theme/tokens";

type ChatHeaderProps = {
  title: string;
  subtitle?: string;
  onBack: () => void;
};

export function ChatHeader({ title, subtitle, onBack }: ChatHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <Feather color={tokens.colors.textPrimary as string} name="chevron-left" size={18} />
      </Pressable>
      <Avatar label={title} style={styles.avatar} />
      <View style={styles.textContent}>
        <AppText numberOfLines={1} style={styles.title}>
          {title}
        </AppText>
        <AppText numberOfLines={1} style={styles.subtitle}>
          {subtitle || "Type.."}
        </AppText>
      </View>
      <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <Feather color={tokens.colors.textPrimary as string} name="video" size={15} />
      </Pressable>
      <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <Feather color={tokens.colors.textPrimary as string} name="phone" size={15} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.separator,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center"
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.colors.surfaceMuted
  },
  textContent: {
    flex: 1,
    gap: 1
  },
  title: {
    ...tokens.typography.section,
    color: tokens.colors.textPrimary
  },
  subtitle: {
    ...tokens.typography.caption,
    color: tokens.colors.textSecondary
  },
  pressed: {
    opacity: tokens.opacity.muted
  }
});
