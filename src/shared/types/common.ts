// Common utility types used across domains
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export type Optional<T> = T | undefined;

export interface Timestamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}
