import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Conversation, Message } from "@/src/types/domain";
import { AppScreen } from "@/src/components/layout/AppScreen";
import { ChatComposer } from "@/src/components/chat/ChatComposer";
import { ChatHeader } from "@/src/components/chat/ChatHeader";
import { MessageBubble } from "@/src/components/chat/MessageBubble";
import { AppText } from "@/src/components/ui/AppText";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useAuthSession } from "@/src/hooks/useAuthSession";
import { getErrorMessage, isUnauthorizedError } from "@/src/services/api/errorMessage";
import { getConversation, listMessages, sendMessage } from "@/src/services/api/messages";
import { tokens } from "@/src/theme/tokens";

function getConversationTitle(conversation: Conversation | null, currentUserId?: string): string {
  if (!conversation) {
    return "Chat";
  }

  const other = conversation.members.find((member) => member.id !== currentUserId);
  return other?.nickname ?? conversation.members[0]?.nickname ?? "Conversazione";
}

function getDayLabel(value?: string): string {
  if (!value) {
    return "Today";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Today";
  }

  const dateLabel = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short"
  }).format(date);

  return `Today, ${dateLabel}`;
}

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ conversationId?: string }>();
  const conversationId = typeof params.conversationId === "string" ? params.conversationId : "";
  const { accessToken, user, refreshSession } = useAuthSession();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [composer, setComposer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => getConversationTitle(conversation, user?.id), [conversation, user?.id]);
  const dayLabel = useMemo(() => getDayLabel(messages[0]?.createdAt), [messages]);

  const loadChat = useCallback(async () => {
    if (!accessToken || !conversationId) {
      return;
    }

    setError(null);

    try {
      const [conversationResult, messagesResult] = await Promise.all([
        getConversation(accessToken, conversationId),
        listMessages(accessToken, conversationId)
      ]);
      setConversation(conversationResult);
      setMessages(messagesResult);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        await refreshSession();
      } else {
        setError(getErrorMessage(err, "Impossibile caricare la chat."));
      }
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, conversationId, refreshSession]);

  useEffect(() => {
    void loadChat();
  }, [loadChat]);

  useEffect(() => {
    if (!accessToken || !conversationId) {
      return undefined;
    }

    const timer = setInterval(() => {
      void loadChat();
    }, 5000);

    return () => clearInterval(timer);
  }, [accessToken, conversationId, loadChat]);

  const handleSend = async () => {
    if (!accessToken || !conversationId || !composer.trim() || isSending) {
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const sentMessage = await sendMessage(accessToken, conversationId, composer.trim());
      setMessages((current) => [...current, sentMessage]);
      setComposer("");
    } catch (err) {
      if (isUnauthorizedError(err)) {
        await refreshSession();
      } else {
        setError(getErrorMessage(err, "Invio messaggio non riuscito."));
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AppScreen contentStyle={styles.screenContent} style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", default: undefined })} style={styles.fill}>
        <View style={styles.container}>
          <ChatHeader title={title} subtitle="Type.." onBack={() => router.back()} />

          {error ? <AppText style={styles.error}>{error}</AppText> : null}

          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={tokens.colors.accent} />
            </View>
          ) : (
            <FlatList
              contentContainerStyle={styles.listContent}
              data={messages}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<EmptyState title="Nessun messaggio" description="Scrivi il primo messaggio." />}
              ListHeaderComponent={<AppText style={styles.dayLabel}>{dayLabel}</AppText>}
              renderItem={({ item }) => <MessageBubble message={item} isMine={item.senderUserId === user?.id} />}
              showsVerticalScrollIndicator={false}
              style={styles.list}
            />
          )}

          <ChatComposer value={composer} onChangeText={setComposer} onSend={() => void handleSend()} disabled={isSending} />
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "transparent"
  },
  screenContent: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  fill: {
    flex: 1
  },
  container: {
    flex: 1
  },
  list: {
    flex: 1
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 12
  },
  dayLabel: {
    alignSelf: "center",
    ...tokens.typography.caption,
    color: tokens.colors.textTertiary,
    marginBottom: 8
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  error: {
    color: tokens.colors.danger,
    marginHorizontal: 16,
    marginTop: 6
  }
});
