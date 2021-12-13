/**
 * The generalized API Response
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
