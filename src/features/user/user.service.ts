import { axiosClient } from "../axios.client";
interface UserResponse {
  id: number;
  username: string;
  email: string;
  nickname: string;
  createdAt: Date;
}

interface ListUser {
  users: UserResponse[]
}

export const userService = {
  async me(): Promise<UserResponse> {
    const res = await axiosClient().get<UserResponse>("/user/me");
    console.log(res.data);
    return res.data;
  },

  async update(email?: string, nickname?: string): Promise<UserResponse> {
    const res = await axiosClient().put<UserResponse>("/user", {
      email,
      nickname,
    });
    return res.data;
  },

  async changePassword(
    password: string,
    newPassword: string,
    reNewPassword: string
  ) {
    const res = await axiosClient().post("/user/password", {
      password,
      newPassword,
      reNewPassword,
    });

    return res.data;
  },

  async all() {
    const res = await axiosClient().get<ListUser>("/user/all");
    return res.data;
  },
};
