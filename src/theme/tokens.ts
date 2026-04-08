import { type TextStyle } from "react-native";

const webFallback = {
  background: "#ffffff",
  surface: "#f6f6f8",
  surfaceMuted: "#ececf0",
  textPrimary: "#0d0d0d",
  textSecondary: "#5f5e5f",
  textTertiary: "#8f8f94",
  accent: "#0d0d0d",
  separator: "#e6e7ea",
  danger: "#ff3b30",
  success: "#34c759",
  outgoingBubble: "#0d0d0d",
  incomingBubble: "#f2f2f4",
  outgoingBubbleText: "#ffffff",
  incomingBubbleText: "#1d1d1f",
  authBackground: "#ffffff",
  authBackgroundAlt: "#ffffff",
  authGradientStart: "#ffffff",
  authGradientEnd: "#f3f4f7",
  authTextPrimary: "#0d0d0d",
  authTextSecondary: "#5f5e5f",
  authInputBackground: "#f2f2f4",
  authInputBorder: "#e6e7ea",
  authButtonText: "#e8e8e8",
  authError: "#c73030"
} as const;

export const tokens = {
  colors: {
    background: webFallback.background,
    surface: webFallback.surface,
    surfaceMuted: webFallback.surfaceMuted,
    textPrimary: webFallback.textPrimary,
    textSecondary: webFallback.textSecondary,
    textTertiary: webFallback.textTertiary,
    accent: webFallback.accent,
    separator: webFallback.separator,
    danger: webFallback.danger,
    success: webFallback.success,
    tabBarBackground: "rgba(255,255,255,0.88)",
    tabIconDefault: webFallback.textSecondary,
    tabIconSelected: webFallback.accent,
    inputBackground: webFallback.authInputBackground,
    inputText: webFallback.textPrimary,
    inputPlaceholder: webFallback.textSecondary,
    bubbleOutgoing: webFallback.outgoingBubble,
    bubbleIncoming: webFallback.incomingBubble,
    bubbleOutgoingText: webFallback.outgoingBubbleText,
    bubbleIncomingText: webFallback.incomingBubbleText,
    authBackground: webFallback.authBackground,
    authBackgroundAlt: webFallback.authBackgroundAlt,
    authGradientStart: webFallback.authGradientStart,
    authGradientEnd: webFallback.authGradientEnd,
    authTextPrimary: webFallback.authTextPrimary,
    authTextSecondary: webFallback.authTextSecondary,
    authInputBackground: webFallback.authInputBackground,
    authInputBorder: webFallback.authInputBorder,
    authButtonText: webFallback.authButtonText,
    authError: webFallback.authError
  },
  spacing: {
    none: 0,
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32
  },
  radius: {
    sm: 12,
    md: 16,
    lg: 22,
    xl: 28,
    pill: 999
  },
  typography: {
    title: {
      fontFamily: "Chalet",
      fontSize: 32,
      lineHeight: 36,
      letterSpacing: -1.12
    } as TextStyle,
    heading: {
      fontFamily: "Chalet",
      fontSize: 22,
      lineHeight: 26,
      letterSpacing: -0.77
    } as TextStyle,
    section: {
      fontFamily: "Chalet",
      fontSize: 17,
      lineHeight: 22,
      letterSpacing: -0.59
    } as TextStyle,
    body: {
      fontFamily: "Chalet",
      fontSize: 16,
      lineHeight: 18,
      letterSpacing: -0.56
    } as TextStyle,
    bodyMedium: {
      fontFamily: "Chalet",
      fontSize: 16,
      lineHeight: 20,
      letterSpacing: -0.56
    } as TextStyle,
    caption: {
      fontFamily: "Chalet",
      fontSize: 14,
      lineHeight: 18,
      letterSpacing: -0.49
    } as TextStyle,
    button: {
      fontFamily: "Chalet",
      fontSize: 16,
      lineHeight: 20,
      letterSpacing: -0.56
    } as TextStyle
  },
  iconSizes: {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 28
  },
  layout: {
    buttonHeight: 50,
    inputHeight: 50,
    avatarSize: 40,
    tabBarMinHeight: 56,
    conversationRowMinHeight: 72
  },
  opacity: {
    disabled: 0.5,
    muted: 0.72
  },
  shadows: {
    card: {
      shadowColor: webFallback.separator,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 1
    }
  }
} as const;

export type AppTokens = typeof tokens;
