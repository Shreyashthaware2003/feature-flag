import { api } from "@/lib/api";
import type {
  AccessKeyListItem,
  CreateAccessKeyPayload,
  CreateAccessKeyResponse,
} from "../access-keys.types";

export async function fetchAccessKeysApi(
  accessToken: string,
): Promise<AccessKeyListItem[]> {
  return api.get<AccessKeyListItem[]>("/access-keys", {
    token: accessToken,
    cache: "no-store",
  });
}

export async function createAccessKeyApi(
  accessToken: string,
  payload: CreateAccessKeyPayload,
): Promise<CreateAccessKeyResponse> {
  return api.post<CreateAccessKeyResponse>("/access-keys", payload, {
    token: accessToken,
  });
}

export async function revokeAccessKeyApi(
  accessToken: string,
  id: string,
): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`/access-keys/${id}`, {
    token: accessToken,
  });
}
