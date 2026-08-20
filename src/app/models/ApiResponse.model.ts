export interface ApiResponse<T> {
  data: T;
  offset: number;
  limit: number;
  total: number;
}
