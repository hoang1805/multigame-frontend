export interface MoveData {
  matchId: number;
  move: {
    moveFrom?: Cell;
    moveTo?: Cell;
    removed?: BallState[];
    added?: BallState[];
    nextBalls?: number[];
    points?: number;
  };
}

interface Cell {
  x: number;
  y: number;
}

export interface BallState extends Cell {
  color: number;
}

export interface StateInterface {
  balls: BallState[];
  time: number;
  helpRemaining: number;
  nextBalls: number[];
  gameOver: boolean;
}

export interface HelpData {
  from: Cell;
  to: Cell;
}
