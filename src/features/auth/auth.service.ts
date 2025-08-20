import { store } from "../../app/store";
import { axiosClient } from "../axios.client";
import { clear } from "../user/user.slice";
import { logout as sliceLogout } from "./auth.slice";
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await axiosClient().post<LoginResponse>("/auth/login", {
      username,
      password,
    });
    return res.data;
  },

  async register(username: string, email: string, password: string, rePassword: string, nickname?: string) {
    const res = await axiosClient().post("/auth/register", {
      username,
      password,
      email,
      rePassword,
      nickname
    });
    return res.data;
  },

  async refresh(token: string): Promise<RefreshResponse> {
    const res = await axiosClient().get<RefreshResponse>(`/auth/refresh?refreshToken=${token}`);
    return res.data;
  },

  logout() {
    store.dispatch(sliceLogout());
    store.dispatch(clear());
  }
};
