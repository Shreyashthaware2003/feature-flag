import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createFlagApi, fetchFlagsApi } from "./api/flags.api";
import type { CreateFlagPayload, FeatureFlag, FlagsState } from "./flags.types";

const initialState: FlagsState = {
  items: [],
  fetchStatus: "idle",
  createStatus: "idle",
  error: null,
};

export const fetchFlags = createAsyncThunk<FeatureFlag[]>(
  "dashboard/flags/fetchFlags",
  async () => {
    return await fetchFlagsApi();
  },
);

export const createFlag = createAsyncThunk<FeatureFlag, CreateFlagPayload>(
  "dashboard/flags/createFlag",
  async (payload) => {
    return await createFlagApi(payload);
  },
);

const flagsSlice = createSlice({
  name: "flags",
  initialState,
  reducers: {
    resetCreateFlagState: (state) => {
      state.createStatus = "idle";
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
      });
  },
});

export const { resetCreateFlagState, clearFlagsError } = flagsSlice.actions;
export default flagsSlice.reducer;
