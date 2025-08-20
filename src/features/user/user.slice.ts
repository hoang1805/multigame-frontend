import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface User {
    id: number;
    email: string;
    username: string;
    nickname: string;
  };

interface UserState {
  user?: User;
}

const initialState: UserState = {
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    cacheUser: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload.user;
    },
    clear: (state) => {
      state.user = undefined;
    },
  },
});

export const {cacheUser, clear} = userSlice.actions;
export default userSlice.reducer;
