import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppScreen } from "@/src/components/layout/AppScreen";
import { AppText } from "@/src/components/ui/AppText";
import { AppTitle } from "@/src/components/ui/AppTitle";
import { Card } from "@/src/components/ui/Card";
import { PrimaryButton } from "@/src/components/ui/PrimaryButton";
import { SecondaryButton } from "@/src/components/ui/SecondaryButton";
import { SectionTitle } from "@/src/components/ui/SectionTitle";
import { TextField } from "@/src/components/ui/TextField";
import { useAuthSession } from "@/src/hooks/useAuthSession";
import { getErrorMessage, isUnauthorizedError } from "@/src/services/api/errorMessage";
import { updateMe } from "@/src/services/api/profile";
import { tokens } from "@/src/theme/tokens";

export default function ProfileScreen() {
  const { user, accessToken, refreshSession, reloadMe, signOut } = useAuthSession();
  const [nicknameDraft, setNicknameDraft] = useState(user?.nickname ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setNicknameDraft(user?.nickname ?? "");
  }, [user?.nickname]);

  const canSave = useMemo(() => {
    if (!user) {
      return false;
    }
    return !!nicknameDraft.trim() && nicknameDraft.trim() !== user.nickname && !isSaving;
  }, [isSaving, nicknameDraft, user]);

  const handleReloadProfile = async () => {
    setError(null);
    setSuccess(null);
    setIsRefreshing(true);

    try {
      await reloadMe();
    } catch (err) {
      if (isUnauthorizedError(err)) {
        await refreshSession();
      } else {
        setError(getErrorMessage(err, "Aggiornamento profilo non riuscito."));
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveNickname = async () => {
    if (!accessToken || !canSave) {
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      await updateMe(accessToken, nicknameDraft.trim());
      await reloadMe();
      setSuccess("Nickname aggiornato.");
    } catch (err) {
      if (isUnauthorizedError(err)) {
        await refreshSession();
      } else {
        setError(getErrorMessage(err, "Salvataggio non riuscito."));
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppScreen scroll>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppTitle>Profilo</AppTitle>
          <AppText style={styles.subtitle}>Gestione sessione e dati account.</AppText>
        </View>

        <Card style={styles.card}>
          <SectionTitle>Dati utente</SectionTitle>
          <AppText>Nickname attuale: {user?.nickname ?? "-"}</AppText>
          <AppText>Email: {user?.email ?? "-"}</AppText>
          <AppText>Stato: {user?.status ?? "-"}</AppText>
        </Card>

        <Card style={styles.card}>
          <SectionTitle>Modifica nickname</SectionTitle>
          <TextField label="Nuovo nickname" value={nicknameDraft} onChangeText={setNicknameDraft} autoCapitalize="none" />
          <PrimaryButton label={isSaving ? "Salvataggio..." : "Salva nickname"} onPress={() => void handleSaveNickname()} disabled={!canSave} />
        </Card>

        <Card style={styles.card}>
          <SectionTitle>Sessione</SectionTitle>
          <AppText>Autenticato: {user ? "si" : "no"}</AppText>
          <AppText>Access token presente: {accessToken ? "si" : "no"}</AppText>
          <SecondaryButton label={isRefreshing ? "Aggiorno..." : "Ricarica profilo"} onPress={() => void handleReloadProfile()} disabled={isRefreshing} />
          <SecondaryButton label="Logout" onPress={() => void signOut()} />
        </Card>

        {error ? <AppText style={styles.error}>{error}</AppText> : null}
        {success ? <AppText style={styles.success}>{success}</AppText> : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.md
  },
  header: {
    gap: tokens.spacing.xs
  },
  subtitle: {
    color: tokens.colors.textSecondary
  },
  card: {
    gap: tokens.spacing.sm
  },
  error: {
    color: tokens.colors.danger
  },
  success: {
    color: tokens.colors.success
  }
});
