import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { tokens } from "@/src/theme/tokens";
import { AppText } from "./AppText";

type AvatarProps = {
  label: string;
  style?: StyleProp<ViewStyle>;
};

function getInitials(label: string): string {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }

  return parts
    .slice(0, 2)
    .map((item) => item.charAt(0).toUpperCase())
    .join("");
}

export function Avatar({ label, style }: AvatarProps) {
  return (
    <View style={[styles.avatar, style]}>
      <AppText style={styles.text}>{getInitials(label)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: tokens.layout.avatarSize,
    height: tokens.layout.avatarSize,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    ...tokens.typography.caption,
    color: tokens.colors.textSecondary
  }
});
