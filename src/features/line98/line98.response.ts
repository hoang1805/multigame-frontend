import type { ConfigInterface } from "./line98.config";
import type { StateInterface } from "./line98.data";

export interface Line98Response {
  config: ConfigInterface;
  state: StateInterface;
  score: number;
}

export interface GameResponse {
  id: number;
}

export interface Line98 {
  id: number;
  config: ConfigInterface;
  state: StateInterface;
  score: number;
  endReason: string;
}

export interface PaginationResponse {
  total: number;
  page: number;
  size: number;
  totalPages: number;
  data: Line98[];
}
