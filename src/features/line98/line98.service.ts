import { axiosClient } from "../axios.client";
import {
  Line98Response,
  PaginationResponse,
  type GameResponse,
} from "./line98.response";

export const line98Service = {
  async get(matchId?: string) {
    const res = await axiosClient().get<Line98Response>(`/line98/${matchId}`);
    return res.data;
  },

  async play() {
    const res = await axiosClient().post<GameResponse>(`/line98/play`);
    return res.data;
  },

  async paginate(page: number, size: number) {
    const res = await axiosClient().get<PaginationResponse>("/line98/history", {
      params: {
        page,
        size,
      },
    });

    return res.data;
  },
};
