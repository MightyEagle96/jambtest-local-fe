import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

export const refreshSlice = createSlice({
  name: "refresh",
  initialState,
  reducers: {
    setRefresh: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setRefresh } = refreshSlice.actions;

export default refreshSlice.reducer;
