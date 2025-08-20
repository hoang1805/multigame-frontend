import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import globalLoadingReducer from "../features/loading/global.loading.slice";
import appReducer from "../features/app.slice";
import userReducer from "../features/user/user.slice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    globalLoading: globalLoadingReducer,
    app: appReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;