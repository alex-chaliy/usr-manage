export interface ApiResponse<T> {
  data: T;
  offset: number;
  limit: number;
  total: number;
}

// 'idle' nothing tried to be loaded; initial state
export type AsyncState = 'idle' | 'loading' | 'success' | 'error';
