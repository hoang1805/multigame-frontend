import { axiosClient } from "../axios.client";
import type { PaginationResponse } from "./caro.response";

export const caroService = {
  async paginate(page: number, size: number) {
    const res = await axiosClient().get<PaginationResponse>("/caro/history", {
      params: {
        page,
        size,
      },
    });

    return res.data;
  },
};
