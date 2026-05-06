import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import { getStoredAccessToken } from "@/redux/features/auth/token-storage";
import {
  createAccessKeyApi,
  fetchAccessKeysApi,
  revokeAccessKeyApi,
} from "./api/access-keys.api";
import type {
  AccessKeysState,
  CreateAccessKeyPayload,
  CreateAccessKeyResponse,
} from "./access-keys.types";

const initialState: AccessKeysState = {
  items: [],
  latestCreatedKey: null,
  listStatus: "idle",
  createStatus: "idle",
  revokeStatus: "idle",
  error: null,
};

function getToken(state: RootState): string {
  const token = state.auth.accessToken ?? getStoredAccessToken();
  if (!token) {
    throw new Error("Authentication required");
  }
  return token;
}

export const fetchAccessKeys = createAsyncThunk<
  AccessKeysState["items"],
  void,
  { state: RootState }
>("dashboard/accessKeys/fetch", async (_, { getState }) => {
  return await fetchAccessKeysApi(getToken(getState()));
});

export const createAccessKey = createAsyncThunk<
  CreateAccessKeyResponse,
  CreateAccessKeyPayload,
  { state: RootState }
>("dashboard/accessKeys/create", async (payload, { getState }) => {
  return await createAccessKeyApi(getToken(getState()), payload);
});

export const revokeAccessKey = createAsyncThunk<
  { id: string; message: string },
  string,
  { state: RootState }
>("dashboard/accessKeys/revoke", async (id, { getState }) => {
  const response = await revokeAccessKeyApi(getToken(getState()), id);
  return { id, message: response.message };
});

const accessKeysSlice = createSlice({
  name: "accessKeys",
  initialState,
  reducers: {
    clearAccessKeysError: (state) => {
      state.error = null;
    },
    clearLatestCreatedKey: (state) => {
      state.latestCreatedKey = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccessKeys.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAccessKeys.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAccessKeys.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.error.message ?? "Failed to fetch access keys";
      })
      .addCase(createAccessKey.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(createAccessKey.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.latestCreatedKey = action.payload;
        state.items.unshift({
          id: action.payload.id,
          name: action.payload.name,
          prefix: action.payload.prefix,
          last4: action.payload.last4,
          isActive: true,
          createdAt: action.payload.createdAt,
          updatedAt: action.payload.createdAt,
          lastUsedAt: null,
          revokedAt: null,
        });
      })
      .addCase(createAccessKey.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.error.message ?? "Failed to create access key";
      })
      .addCase(revokeAccessKey.pending, (state) => {
        state.revokeStatus = "loading";
        state.error = null;
      })
      .addCase(revokeAccessKey.fulfilled, (state, action) => {
        state.revokeStatus = "succeeded";
        state.items = state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                isActive: false,
                revokedAt: new Date().toISOString(),
              }
            : item,
        );
      })
      .addCase(revokeAccessKey.rejected, (state, action) => {
        state.revokeStatus = "failed";
        state.error = action.error.message ?? "Failed to revoke access key";
      });
  },
});

export const { clearAccessKeysError, clearLatestCreatedKey } =
  accessKeysSlice.actions;

export default accessKeysSlice.reducer;
