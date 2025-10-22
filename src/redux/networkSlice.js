import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

export const networkSlice = createSlice({
  name: "networkControl",
  initialState,
  reducers: {
    setNetwork: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setNetwork } = networkSlice.actions;

export default networkSlice.reducer;
