import { configureStore } from "@reduxjs/toolkit";
import durationSlice from "./durationSlice";
import networkSlice from "./networkSlice";

export const store = configureStore({
  reducer: { durationSlice, networkSlice },
});
