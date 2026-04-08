export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthUser = {
  id: string;
  email: string;
  nickname: string;
  isEmailVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type SessionPayload = SessionTokens & {
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
};

export type AuthSuccess = {
  user: AuthUser;
  session: SessionPayload;
};

export type ConversationMember = {
  id: string;
  nickname: string;
  status: string;
};

export type ConversationLastMessage = {
  id: string;
  senderUserId: string;
  body: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  type: "direct";
  createdAt: string;
  members: ConversationMember[];
  lastMessage: ConversationLastMessage | null;
};

export type Message = {
  id: string;
  conversationId: string;
  senderUserId: string;
  senderNickname: string;
  body: string;
  createdAt: string;
  editedAt: string | null;
};

export type ApiErrorPayload = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
