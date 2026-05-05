import { combineReducers } from "@reduxjs/toolkit";
import flagsReducer from "./features/dashboard/flags/flags.slice";
import evaluationReducer from "./features/dashboard/evaluation/evaluation.slice";

const rootReducer = combineReducers({
  dashboard: combineReducers({
    flags: flagsReducer,
    evaluation: evaluationReducer,
  }),
});

export default rootReducer;
