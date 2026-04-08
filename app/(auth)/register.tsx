import { useMemo, useState, type ComponentProps } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthSession } from "@/src/hooks/useAuthSession";
import { getErrorMessage } from "@/src/services/api/errorMessage";
import { tokens } from "@/src/theme/tokens";

type AuthInputFieldProps = {
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: ComponentProps<typeof TextInput>["autoComplete"];
  keyboardType?: ComponentProps<typeof TextInput>["keyboardType"];
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  textContentType?: ComponentProps<typeof TextInput>["textContentType"];
  underlineValue?: boolean;
  value: string;
};

function AuthInputField({
  autoCapitalize = "none",
  autoComplete,
  keyboardType,
  label,
  onChangeText,
  placeholder,
  secureTextEntry,
  textContentType,
  underlineValue,
  value
}: AuthInputFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.colors.authTextSecondary}
        secureTextEntry={secureTextEntry}
        style={[styles.fieldInput, underlineValue && styles.fieldInputUnderlined]}
        textContentType={textContentType}
        value={value}
      />
    </View>
  );
}

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signUp } = useAuthSession();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const disabled = useMemo(() => {
    return isSubmitting || !nickname.trim() || !email.trim() || !password;
  }, [email, isSubmitting, nickname, password]);

  const handleSubmit = async () => {
    if (disabled) {
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      await signUp({
        nickname: nickname.trim(),
        email: email.trim(),
        password
      });
    } catch (error) {
      setFormError(getErrorMessage(error, "Registrazione non riuscita."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(auth)/admin");
  };

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <LinearGradient
        colors={[tokens.colors.authGradientStart as string, tokens.colors.authGradientEnd as string]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.gradient}
      >
        <StatusBar style="dark" translucent backgroundColor="transparent" />
        <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", default: undefined })} style={styles.fill}>
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(24, insets.bottom + 16) }]}
            keyboardDismissMode={Platform.select({ ios: "interactive", default: "on-drag" })}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.container, { paddingTop: insets.top + 58 }]}>
              <Image source={require("../../assets/images/filonero-icon.png")} style={styles.logo} />

              <View style={styles.header}>
                <Text style={styles.title}>Registrati</Text>
                <Text style={styles.subtitle}>Riempi ste bischerate e vai!</Text>
              </View>

              <View style={styles.form}>
                <AuthInputField
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  label="Email"
                  onChangeText={setEmail}
                  placeholder="nome@email.com"
                  underlineValue
                  value={email}
                />
                <AuthInputField
                  autoCapitalize="none"
                  autoComplete="nickname"
                  label="Nickname"
                  onChangeText={setNickname}
                  placeholder="he_bella_hosa"
                  value={nickname}
                />
                <AuthInputField
                  autoCapitalize="none"
                  autoComplete="password"
                  label="Password"
                  onChangeText={setPassword}
                  placeholder="••••••••••••"
                  secureTextEntry
                  textContentType="newPassword"
                  value={password}
                />
              </View>

              {formError ? <Text style={styles.error}>{formError}</Text> : null}

              <View style={styles.actionBlock}>
                <Pressable
                  accessibilityRole="button"
                  disabled={disabled}
                  onPress={handleSubmit}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                    pressed && styles.pressedScale,
                    disabled && styles.disabled
                  ]}
                >
                  <Text style={styles.buttonLabel}>{isSubmitting ? "Registrazione in corso..." : "Registrati"}</Text>
                </Pressable>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={handleGoToLogin}
                style={({ pressed }) => [styles.switchLink, pressed && styles.pressed, pressed && styles.pressedScale]}
              >
                <Text style={styles.switchLinkText}>Accedi con un account</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.authBackground
  },
  gradient: {
    flex: 1
  },
  fill: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center"
  },
  container: {
    width: "100%",
    maxWidth: 430,
    alignItems: "center",
    paddingHorizontal: 20
  },
  logo: {
    width: 114,
    height: 114,
    borderRadius: 24
  },
  header: {
    width: "100%",
    maxWidth: 275,
    marginTop: 29,
    gap: 8,
    alignItems: "center"
  },
  title: {
    fontFamily: "Chalet",
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -1.12,
    color: tokens.colors.authTextPrimary,
    textAlign: "center"
  },
  subtitle: {
    fontFamily: "Chalet",
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.7,
    color: tokens.colors.authTextSecondary,
    textAlign: "center"
  },
  form: {
    width: "100%",
    marginTop: 31,
    gap: 9
  },
  field: {
    height: 73,
    gap: 5
  },
  fieldLabel: {
    fontFamily: "Chalet",
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.49,
    color: tokens.colors.authTextSecondary,
    paddingHorizontal: 18
  },
  fieldInput: {
    height: 50,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.authInputBackground,
    borderWidth: 1,
    borderColor: tokens.colors.authInputBorder,
    color: tokens.colors.authTextSecondary,
    paddingHorizontal: 18,
    paddingVertical: 0,
    textAlignVertical: "center",
    fontFamily: "Chalet",
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: -0.56
  },
  fieldInputUnderlined: {
    textDecorationLine: "underline"
  },
  error: {
    width: "100%",
    marginTop: 8,
    fontFamily: "Chalet",
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.49,
    color: tokens.colors.authError
  },
  button: {
    width: "100%",
    height: 50,
    marginTop: 34,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.authTextPrimary,
    alignItems: "center",
    justifyContent: "center"
  },
  actionBlock: {
    width: "100%"
  },
  buttonLabel: {
    fontFamily: "Chalet",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.56,
    color: tokens.colors.authButtonText
  },
  switchLink: {
    width: "100%",
    maxWidth: 275,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4
  },
  switchLinkText: {
    fontFamily: "Chalet",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.56,
    color: tokens.colors.authTextPrimary,
    textAlign: "center"
  },
  pressed: {
    opacity: tokens.opacity.muted
  },
  pressedScale: {
    transform: [{ scale: 0.985 }]
  },
  disabled: {
    opacity: tokens.opacity.disabled
  }
});
