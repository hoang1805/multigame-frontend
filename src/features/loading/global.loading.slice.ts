import { createSlice } from "@reduxjs/toolkit";

interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: false,
};

const globalLoadingSlice = createSlice({
  name: "global.loading",
  initialState,
  reducers: {
    show: (state) => {
      state.isLoading = true;
    },
    hide: (state) => {
      state.isLoading = false;
    },
  },
});


export const {show, hide} = globalLoadingSlice.actions;
export default globalLoadingSlice.reducer;