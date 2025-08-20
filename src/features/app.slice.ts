import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  globalSiderCollapsed: boolean;
}

const initialState: AppState = {
  globalSiderCollapsed: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleSider: (state) => {
      state.globalSiderCollapsed = !state.globalSiderCollapsed;
    },
  },
});

export const {toggleSider} = appSlice.actions;
export default appSlice.reducer;