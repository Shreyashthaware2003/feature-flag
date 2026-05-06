import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchActivityApi, fetchSummaryApi } from "./api/analytics.api";
import type { RootState } from "@/redux/store";
import { getStoredAccessToken } from "@/redux/features/auth/token-storage";
import type { ActivityItem, AnalyticsState, AnalyticsSummary } from "./analytics.types";

const initialState: AnalyticsState = {
  summary: null,
  activity: [],
  summaryStatus: "idle",
  activityStatus: "idle",
  error: null,
};

function getToken(state: RootState): string {
  const token = state.auth.accessToken ?? getStoredAccessToken();
  if (!token) {
    throw new Error("Authentication required");
  }
  return token;
}

export const fetchAnalyticsSummary = createAsyncThunk<
  AnalyticsSummary,
  void,
  { state: RootState }
>("dashboard/analytics/fetchSummary", async (_, { getState }) => {
  return await fetchSummaryApi(getToken(getState()));
});

export const fetchAnalyticsActivity = createAsyncThunk<
  ActivityItem[],
  void,
  { state: RootState }
>("dashboard/analytics/fetchActivity", async (_, { getState }) => {
  return await fetchActivityApi(getToken(getState()));
});

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsSummary.pending, (state) => {
        state.summaryStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAnalyticsSummary.fulfilled, (state, action) => {
        state.summaryStatus = "succeeded";
        state.summary = action.payload;
      })
      .addCase(fetchAnalyticsSummary.rejected, (state, action) => {
        state.summaryStatus = "failed";
        state.error = action.error.message ?? "Failed to load summary";
      })
      .addCase(fetchAnalyticsActivity.pending, (state) => {
        state.activityStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAnalyticsActivity.fulfilled, (state, action) => {
        state.activityStatus = "succeeded";
        state.activity = action.payload;
      })
      .addCase(fetchAnalyticsActivity.rejected, (state, action) => {
        state.activityStatus = "failed";
        state.error = action.error.message ?? "Failed to load activity";
      });
  },
});

export const { clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
