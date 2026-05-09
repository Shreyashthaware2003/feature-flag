import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.slice";
import flagsReducer from "./features/dashboard/flags/flags.slice";
import evaluationReducer from "./features/dashboard/evaluation/evaluation.slice";
import analyticsReducer from "./features/dashboard/analytics/analytics.slice";
import accessKeysReducer from "./features/dashboard/access-keys/access-keys.slice";
import { clearAuthState } from "./features/auth/auth.slice";

const appReducer = combineReducers({
  auth: authReducer,
  dashboard: combineReducers({
    flags: flagsReducer,
    evaluation: evaluationReducer,
    analytics: analyticsReducer,
    accessKeys: accessKeysReducer,
  }),
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: { type: string },
) => {
  if (action.type === clearAuthState.type) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
