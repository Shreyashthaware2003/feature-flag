import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { evaluateFlagApi } from "./api/evaluation.api";
import type { RootState } from "@/redux/store";
import { getStoredAccessToken } from "@/redux/features/auth/token-storage";
import type {
  EvaluationState,
  EvaluateRequest,
  EvaluateResponse,
} from "./evaluation.types";

const initialState: EvaluationState = {
  result: null,
  status: "idle",
  error: null,
};

export const evaluateFlag = createAsyncThunk<EvaluateResponse, EvaluateRequest>(
  "dashboard/evaluation/evaluateFlag",
  async (payload, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken ?? getStoredAccessToken();
    if (!token) {
      throw new Error("Authentication required");
    }
    return await evaluateFlagApi(token, payload);
  },
);

const evaluationSlice = createSlice({
  name: "evaluation",
  initialState,
  reducers: {
    resetEvaluationState: (state) => {
      state.result = null;
      state.status = "idle";
      state.error = null;
    },
    clearEvaluationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(evaluateFlag.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(evaluateFlag.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.result = action.payload;
      })
      .addCase(evaluateFlag.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to evaluate flag";
      });
  },
});

export const { resetEvaluationState, clearEvaluationError } =
  evaluationSlice.actions;
export default evaluationSlice.reducer;
