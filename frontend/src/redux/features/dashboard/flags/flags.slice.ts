import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createFlagApi,
  deleteFlagApi,
  fetchFlagsApi,
  updateFlagApi,
} from "./api/flags.api";
import type { RootState } from "@/redux/store";
import { getStoredAccessToken } from "@/redux/features/auth/token-storage";
import type {
  CreateFlagPayload,
  FeatureFlag,
  FlagsState,
  UpdateFlagPayload,
} from "./flags.types";

const initialState: FlagsState = {
  items: [],
  fetchStatus: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  error: null,
};

function getToken(state: RootState): string {
  const token = state.auth.accessToken ?? getStoredAccessToken();
  if (!token) {
    throw new Error("Authentication required");
  }
  return token;
}

export const fetchFlags = createAsyncThunk<FeatureFlag[], void, { state: RootState }>(
  "dashboard/flags/fetchFlags",
  async (_, { getState }) => {
    return await fetchFlagsApi(getToken(getState()));
  },
);

export const createFlag = createAsyncThunk<
  FeatureFlag,
  CreateFlagPayload,
  { state: RootState }
>(
  "dashboard/flags/createFlag",
  async (payload, { getState }) => {
    return await createFlagApi(getToken(getState()), payload);
  },
);

export const updateFlag = createAsyncThunk<
  FeatureFlag,
  { id: string; payload: UpdateFlagPayload },
  { state: RootState }
>("dashboard/flags/updateFlag", async ({ id, payload }, { getState }) => {
  return await updateFlagApi(getToken(getState()), id, payload);
});

export const deleteFlag = createAsyncThunk<
  { id: string; affected?: number },
  string,
  { state: RootState }
>("dashboard/flags/deleteFlag", async (id, { getState }) => {
  const result = await deleteFlagApi(getToken(getState()), id);
  return { id, affected: result.affected };
});

export const upsertFlagLocal = createAsyncThunk<FeatureFlag, FeatureFlag>(
  "dashboard/flags/upsertFlagLocal",
  async (flag) => {
    return flag;
  },
);

const flagsSlice = createSlice({
  name: "flags",
  initialState,
  reducers: {
    resetCreateFlagState: (state) => {
      state.createStatus = "idle";
      state.updateStatus = "idle";
      state.deleteStatus = "idle";
      state.error = null;
    },
    clearFlagsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlags.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(fetchFlags.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFlags.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.error.message ?? "Failed to load flags";
      })
      .addCase(createFlag.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(createFlag.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(createFlag.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.error.message ?? "Failed to create flag";
      })
      .addCase(updateFlag.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(updateFlag.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
      })
      .addCase(updateFlag.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.error.message ?? "Failed to update flag";
      })
      .addCase(deleteFlag.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })
      .addCase(deleteFlag.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.items = state.items.filter((item) => item.id !== action.payload.id);
      })
      .addCase(deleteFlag.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.error.message ?? "Failed to delete flag";
      })
      .addCase(upsertFlagLocal.fulfilled, (state, action) => {
        const exists = state.items.some((item) => item.id === action.payload.id);
        state.items = exists
          ? state.items.map((item) =>
              item.id === action.payload.id ? action.payload : item,
            )
          : [action.payload, ...state.items];
      });
  },
});

export const { resetCreateFlagState, clearFlagsError } = flagsSlice.actions;
export default flagsSlice.reducer;
