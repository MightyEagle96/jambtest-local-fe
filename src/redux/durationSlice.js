import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

export const durationSlice = createSlice({
  name: "duration",
  initialState,
  reducers: {
    setDuration: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setDuration } = durationSlice.actions;

export default durationSlice.reducer;
