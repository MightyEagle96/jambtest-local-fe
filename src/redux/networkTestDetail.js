import { createSlice } from "@reduxjs/toolkit";

const initialState = true;

export const networkTestDetailSlice = createSlice({
  name: "networkTestDetail",
  initialState,
  reducers: {
    setNetworkTestDetail: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setNetworkTestDetail } = networkTestDetailSlice.actions;

export default networkTestDetailSlice.reducer;
