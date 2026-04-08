import { StyleSheet, View } from "react-native";
import type { Message } from "@/src/types/domain";
import { AppText } from "@/src/components/ui/AppText";
import { tokens } from "@/src/theme/tokens";

type MessageBubbleProps = {
  message: Message;
  isMine: boolean;
};

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit"
});

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return timeFormatter.format(date);
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  return (
    <View style={[styles.wrapper, isMine ? styles.wrapperMine : styles.wrapperOther]}>
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
        <AppText style={[styles.body, isMine ? styles.bodyMine : styles.bodyOther]}>{message.body}</AppText>
      </View>
      <AppText style={styles.time}>{formatTime(message.createdAt)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: "78%",
    gap: 6
  },
  wrapperMine: {
    alignSelf: "flex-end",
    alignItems: "flex-end"
  },
  wrapperOther: {
    alignSelf: "flex-start",
    alignItems: "flex-start"
  },
  bubble: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  bubbleMine: {
    backgroundColor: tokens.colors.bubbleOutgoing,
    borderBottomRightRadius: 6
  },
  bubbleOther: {
    backgroundColor: tokens.colors.bubbleIncoming,
    borderBottomLeftRadius: 6
  },
  body: {
    ...tokens.typography.body
  },
  bodyMine: {
    color: tokens.colors.bubbleOutgoingText
  },
  bodyOther: {
    color: tokens.colors.bubbleIncomingText
  },
  time: {
    ...tokens.typography.caption,
    color: tokens.colors.textTertiary
  }
});
