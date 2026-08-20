export interface ApiResponse<T> {
  data: T;
  offset: number;
  limit: number;
  total: number;
}

export type AsyncState = 'loading' | 'success' | 'error';