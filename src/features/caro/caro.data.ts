import type { ConfigInterface } from "./caro.config";

export interface CaroFoundData {
  matchId: number;
}

export interface CaroConfigData {
  matchId: number;
  config: ConfigInterface;
}

export interface StateData {
  size?: number;
  time?: number;
  matchId: number;
  board: string[][];
  turn: "X" | "O";
  userSymbol: "X" | "O";
  timeRemain: number; //ms
}

export interface ResultData {
    matchId: number;
    board: string[][];
}

export interface OpponentData {
  matchId: number;
  name: string;
}