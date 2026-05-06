export type AccessKeyListItem = {
  id: string;
  name: string;
  prefix: string;
  last4: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

export type CreateAccessKeyPayload = {
  name?: string;
};

export type CreateAccessKeyResponse = {
  id: string;
  name: string;
  accessKey: string;
  prefix: string;
  last4: string;
  createdAt: string;
};

export type AccessKeysState = {
  items: AccessKeyListItem[];
  latestCreatedKey: CreateAccessKeyResponse | null;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  revokeStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};
