import { configureStore } from "@reduxjs/toolkit";
import { createTransform, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";
import type { AuthState } from "./features/auth/auth.types";

const authTransform = createTransform<AuthState, AuthState>(
  (inboundState) => ({
    user: inboundState.user,
    accessToken: inboundState.accessToken,
    refreshToken: inboundState.refreshToken,
    status: "idle",
    meStatus: "idle",
    error: null,
  }),
  (outboundState) => ({
    user: outboundState.user,
    accessToken: outboundState.accessToken,
    refreshToken: outboundState.refreshToken,
    status: "idle",
    meStatus: "idle",
    error: null,
  }),
  { whitelist: ["auth"] },
);

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  transforms: [authTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
