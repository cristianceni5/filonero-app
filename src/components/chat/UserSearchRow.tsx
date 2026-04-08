import { Pressable, StyleSheet, View } from "react-native";
import { Avatar } from "@/src/components/ui/Avatar";
import { AppText } from "@/src/components/ui/AppText";
import { tokens } from "@/src/theme/tokens";

type SearchUser = {
  id: string;
  nickname: string;
  status: string;
};

type UserSearchRowProps = {
  user: SearchUser;
  onPress: (user: SearchUser) => void;
};

export function UserSearchRow({ user, onPress }: UserSearchRowProps) {
  return (
    <Pressable onPress={() => onPress(user)} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Avatar label={user.nickname} style={styles.avatar} />
      <View style={styles.content}>
        <AppText numberOfLines={1} style={styles.nickname}>
          {user.nickname}
        </AppText>
        <AppText numberOfLines={1} style={styles.status}>
          {user.status || "Utente"}
        </AppText>
      </View>
      <View style={styles.ctaBadge}>
        <AppText style={styles.ctaText}>+</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.surfaceMuted
  },
  content: {
    flex: 1,
    gap: 2
  },
  nickname: {
    ...tokens.typography.section,
    color: tokens.colors.textPrimary
  },
  status: {
    ...tokens.typography.caption,
    color: tokens.colors.textSecondary
  },
  ctaBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: tokens.colors.accent,
    alignItems: "center",
    justifyContent: "center"
  },
  ctaText: {
    ...tokens.typography.caption,
    color: tokens.colors.authButtonText
  },
  pressed: {
    opacity: tokens.opacity.muted
  }
});
