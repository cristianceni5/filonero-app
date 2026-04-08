import Feather from "@expo/vector-icons/Feather";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import type { Conversation } from "@/src/types/domain";
import { AppScreen } from "@/src/components/layout/AppScreen";
import { ConversationRow } from "@/src/components/chat/ConversationRow";
import { UserSearchRow } from "@/src/components/chat/UserSearchRow";
import { AppText } from "@/src/components/ui/AppText";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useAuthSession } from "@/src/hooks/useAuthSession";
import { createDirectConversation, listConversations } from "@/src/services/api/messages";
import { searchUsers } from "@/src/services/api/profile";
import { getErrorMessage, isUnauthorizedError } from "@/src/services/api/errorMessage";
import { tokens } from "@/src/theme/tokens";

type SearchUser = {
  id: string;
  nickname: string;
  status: string;
};

type FilterKey = "all" | "contacts" | "unknown" | "new";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "contacts", label: "Contacts" },
  { key: "unknown", label: "Unknown" },
  { key: "new", label: "New" }
];

export default function MessagesScreen() {
  const router = useRouter();
  const { accessToken, user, refreshSession } = useAuthSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const loadConversations = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const list = await listConversations(accessToken);
      setConversations(list);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        await refreshSession();
      } else {
        setError(getErrorMessage(err, "Impossibile caricare le conversazioni."));
      }
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, refreshSession]);

  useFocusEffect(
    useCallback(() => {
      void loadConversations();
      return undefined;
    }, [loadConversations])
  );

  useEffect(() => {
    if (!accessToken || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      void searchUsers(accessToken, searchQuery.trim())
        .then((results) => {
          setSearchResults(results.filter((item) => item.id !== user?.id));
        })
        .catch(async (err) => {
          if (isUnauthorizedError(err)) {
            await refreshSession();
          } else {
            setError(getErrorMessage(err, "Ricerca utenti non riuscita."));
          }
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 260);

    return () => clearTimeout(timer);
  }, [accessToken, refreshSession, searchQuery, user?.id]);

  const handleOpenConversation = (conversation: Conversation) => {
    router.push({
      pathname: "/(private)/chat/[conversationId]",
      params: { conversationId: conversation.id }
    });
  };

  const handleCreateConversation = async (targetUser: SearchUser) => {
    if (!accessToken) {
      return;
    }

    setError(null);

    try {
      const conversation = await createDirectConversation(accessToken, targetUser.id);
      setSearchResults([]);
      setSearchQuery("");
      router.push({
        pathname: "/(private)/chat/[conversationId]",
        params: { conversationId: conversation.id }
      });
    } catch (err) {
      if (isUnauthorizedError(err)) {
        await refreshSession();
      } else {
        setError(getErrorMessage(err, "Creazione conversazione non riuscita."));
      }
    }
  };

  const filteredConversations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const otherMember = conversation.members.find((member) => member.id !== user?.id);
      const title = (otherMember?.nickname ?? "").toLowerCase();
      const hasQuery = !normalizedQuery || title.includes(normalizedQuery);

      if (!hasQuery) {
        return false;
      }

      if (activeFilter === "all") {
        return true;
      }

      if (activeFilter === "contacts") {
        return conversation.members.length > 1;
      }

      if (activeFilter === "unknown") {
        return (otherMember?.status ?? "").toLowerCase().includes("unknown");
      }

      const createdAt = new Date(conversation.createdAt);
      if (Number.isNaN(createdAt.getTime())) {
        return false;
      }

      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      return createdAt.getTime() >= oneDayAgo;
    });
  }, [activeFilter, conversations, searchQuery, user?.id]);

  const listEmpty = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      return <EmptyState title="Nessun risultato" description="Prova con un altro nome." />;
    }

    return <EmptyState title="Nessuna chat" description="Inizia creando una nuova conversazione." />;
  }, [searchQuery]);

  return (
    <AppScreen contentStyle={styles.screenContent} style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable style={({ pressed }) => [styles.circleButton, pressed && styles.pressed]}>
            <Feather color={tokens.colors.textPrimary as string} name="arrow-left" size={18} />
          </Pressable>
          <AppText style={styles.headerTitle}>Messages</AppText>
          <View style={styles.headerActions}>
            <Pressable style={({ pressed }) => [styles.circleButton, pressed && styles.pressed]}>
              <Feather color={tokens.colors.textPrimary as string} name="camera" size={16} />
            </Pressable>
            <Pressable style={({ pressed }) => [styles.circleButton, pressed && styles.pressed]}>
              <Feather color={tokens.colors.textPrimary as string} name="edit-2" size={16} />
            </Pressable>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <Feather color={tokens.colors.textTertiary as string} name="search" size={16} />
            <TextInput
              autoCapitalize="none"
              placeholder="Search"
              placeholderTextColor={tokens.colors.inputPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>
          <Pressable style={({ pressed }) => [styles.circleButton, pressed && styles.pressed]}>
            <Feather color={tokens.colors.textTertiary as string} name="sliders" size={15} />
          </Pressable>
        </View>

        <View style={styles.filtersRow}>
          {FILTERS.map((filter) => {
            const selected = filter.key === activeFilter;
            return (
              <Pressable
                key={filter.key}
                onPress={() => setActiveFilter(filter.key)}
                style={({ pressed }) => [
                  styles.filterPill,
                  selected && styles.filterPillSelected,
                  pressed && styles.pressed
                ]}
              >
                <AppText style={[styles.filterLabel, selected && styles.filterLabelSelected]}>{filter.label}</AppText>
              </Pressable>
            );
          })}
        </View>

        {error ? <AppText style={styles.error}>{error}</AppText> : null}

        {isSearching && searchQuery.trim().length >= 2 ? (
          <View style={styles.inlineLoading}>
            <ActivityIndicator color={tokens.colors.accent} size="small" />
          </View>
        ) : null}

        {searchResults.length > 0 ? (
          <View style={styles.searchResults}>
            {searchResults.slice(0, 3).map((item) => (
              <UserSearchRow key={item.id} user={item} onPress={() => void handleCreateConversation(item)} />
            ))}
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={tokens.colors.accent} />
          </View>
        ) : (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={filteredConversations}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={listEmpty}
            renderItem={({ item }) => (
              <ConversationRow conversation={item} currentUserId={user?.id} onPress={handleOpenConversation} />
            )}
            showsVerticalScrollIndicator={false}
            style={styles.list}
          />
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "transparent"
  },
  screenContent: {
    backgroundColor: "transparent",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 8
  },
  container: {
    flex: 1,
    gap: 14
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  headerTitle: {
    flex: 1,
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -1.4,
    color: tokens.colors.textPrimary
  },
  headerActions: {
    flexDirection: "row",
    gap: 10
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.separator,
    alignItems: "center",
    justifyContent: "center"
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  searchInputWrap: {
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
  searchInput: {
    flex: 1,
    ...tokens.typography.body,
    color: tokens.colors.inputText,
    paddingVertical: 0,
    textAlignVertical: "center"
  },
  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  filterPill: {
    minHeight: 34,
    borderRadius: 17,
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.separator,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14
  },
  filterPillSelected: {
    backgroundColor: tokens.colors.accent,
    borderColor: tokens.colors.accent
  },
  filterLabel: {
    ...tokens.typography.caption,
    color: tokens.colors.textSecondary
  },
  filterLabelSelected: {
    color: tokens.colors.authButtonText
  },
  error: {
    color: tokens.colors.danger,
    ...tokens.typography.caption
  },
  inlineLoading: {
    paddingTop: 2
  },
  searchResults: {
    borderTopWidth: 1,
    borderTopColor: tokens.colors.separator,
    paddingTop: 8
  },
  list: {
    flex: 1
  },
  listContent: {
    paddingBottom: 16
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  pressed: {
    opacity: tokens.opacity.muted
  }
});
