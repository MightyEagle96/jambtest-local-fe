import { configureStore } from "@reduxjs/toolkit";
import durationSlice from "./durationSlice";
import networkSlice from "./networkSlice";
import networkTestDetailSlice from "./networkTestDetail";

export const store = configureStore({
  reducer: { durationSlice, networkSlice, networkTestDetailSlice },
});
