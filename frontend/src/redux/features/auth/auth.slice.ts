import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  loginApi,
  logoutApi,
  meApi,
  refreshApi,
  signupApi,
} from "./api/auth.api";
import type {
  AuthResponse,
  AuthState,
  AuthTokens,
  AuthUser,
  LoginPayload,
  RefreshPayload,
  SignupPayload,
} from "./auth.types";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle",
  meStatus: "idle",
  error: null,
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export const signup = createAsyncThunk<AuthResponse, SignupPayload>(
  "auth/signup",
  async (payload) => {
    return await signupApi(payload);
  },
);

export const login = createAsyncThunk<AuthResponse, LoginPayload>(
  "auth/login",
  async (payload) => {
    return await loginApi(payload);
  },
);

export const refreshSession = createAsyncThunk<AuthResponse, RefreshPayload>(
  "auth/refreshSession",
  async (payload) => {
    return await refreshApi(payload);
  },
);

export const fetchMe = createAsyncThunk<AuthUser, { accessToken: string }>(
  "auth/fetchMe",
  async ({ accessToken }) => {
    return await meApi(accessToken);
  },
);

export const logout = createAsyncThunk<
  { message: string },
  { accessToken: string }
>("auth/logout", async ({ accessToken }) => {
  return await logoutApi(accessToken);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; tokens: AuthTokens }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.tokens.accessToken;
      state.refreshToken = action.payload.tokens.refreshToken;
      state.status = "succeeded";
      state.error = null;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = "idle";
      state.meStatus = "idle";
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error, "Signup failed");
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error, "Login failed");
      })
      .addCase(refreshSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error, "Session refresh failed");
      })
      .addCase(fetchMe.pending, (state) => {
        state.meStatus = "loading";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.meStatus = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.meStatus = "failed";
        state.error = getErrorMessage(action.error, "Failed to fetch profile");
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.meStatus = "idle";
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error, "Logout failed");
      });
  },
});

export const { setCredentials, clearAuthState, clearAuthError } =
  authSlice.actions;
export default authSlice.reducer;
