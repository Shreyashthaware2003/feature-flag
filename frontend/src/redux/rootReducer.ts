import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.slice";
import flagsReducer from "./features/dashboard/flags/flags.slice";
import evaluationReducer from "./features/dashboard/evaluation/evaluation.slice";
import analyticsReducer from "./features/dashboard/analytics/analytics.slice";
import accessKeysReducer from "./features/dashboard/access-keys/access-keys.slice";

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: combineReducers({
    flags: flagsReducer,
    evaluation: evaluationReducer,
    analytics: analyticsReducer,
    accessKeys: accessKeysReducer,
  }),
});

export default rootReducer;
