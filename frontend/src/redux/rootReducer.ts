import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.slice";
import flagsReducer from "./features/dashboard/flags/flags.slice";
import evaluationReducer from "./features/dashboard/evaluation/evaluation.slice";

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: combineReducers({
    flags: flagsReducer,
    evaluation: evaluationReducer,
  }),
});

export default rootReducer;
