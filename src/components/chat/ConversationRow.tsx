import { Pressable, StyleSheet, View } from "react-native";
import type { Conversation } from "@/src/types/domain";
import { Avatar } from "@/src/components/ui/Avatar";
import { AppText } from "@/src/components/ui/AppText";
import { tokens } from "@/src/theme/tokens";

type ConversationRowProps = {
  conversation: Conversation;
  currentUserId?: string;
  onPress: (conversation: Conversation) => void;
};

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit"
});

function getConversationTitle(conversation: Conversation, currentUserId?: string): string {
  const other = conversation.members.find((member) => member.id !== currentUserId);
  return other?.nickname ?? conversation.members[0]?.nickname ?? "Conversazione";
}

function formatTime(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return timeFormatter.format(date);
}

export function ConversationRow({ conversation, currentUserId, onPress }: ConversationRowProps) {
  const title = getConversationTitle(conversation, currentUserId);
  const subtitle = conversation.lastMessage?.body ?? "Type...";
  const timeLabel = formatTime(conversation.lastMessage?.createdAt);
  const hasUnread = !!conversation.lastMessage && conversation.lastMessage.senderUserId !== currentUserId;

  return (
    <Pressable onPress={() => onPress(conversation)} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Avatar label={title} style={styles.avatar} />
      <View style={styles.content}>
        <AppText numberOfLines={1} style={styles.title}>
          {title}
        </AppText>
        <AppText numberOfLines={1} style={styles.subtitle}>
          {subtitle}
        </AppText>
      </View>
      <View style={styles.meta}>
        {!!timeLabel && <AppText style={styles.time}>{timeLabel}</AppText>}
        {hasUnread ? (
          <View style={styles.badge}>
            <AppText style={styles.badgeText}>1</AppText>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.colors.surfaceMuted
  },
  content: {
    flex: 1,
    gap: 2
  },
  title: {
    ...tokens.typography.section,
    color: tokens.colors.textPrimary
  },
  subtitle: {
    ...tokens.typography.caption,
    color: tokens.colors.textSecondary
  },
  meta: {
    minWidth: 52,
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8
  },
  time: {
    ...tokens.typography.caption,
    color: tokens.colors.textTertiary
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: tokens.colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5
  },
  badgeText: {
    ...tokens.typography.caption,
    color: tokens.colors.authButtonText
  },
  pressed: {
    opacity: tokens.opacity.muted
  }
});
