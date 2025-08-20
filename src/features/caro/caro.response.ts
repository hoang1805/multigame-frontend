
export interface Caro {
  id: number;
  winner: number | null;
  endReason: string | null;
  isFinish: boolean;
}

export interface PaginationResponse {
  total: number;
  page: number;
  size: number;
  totalPages: number;
  data: Caro[];
}
