/**
 * Generic pagination options interface
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Generic pagination metadata interface
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Generic query input interface for list operations
 */
export interface QueryListInput<TFilters = any> {
  filters?: TFilters;
  pagination: PaginationOptions;
}

/**
 * Generic query result interface for list operations
 */
export interface QueryListResult<TData = any> {
  data: TData[];
  pagination: PaginationMeta;
}

/**
 * Creates pagination metadata from pagination options and total count
 */
export function createPaginationMeta(
  page: number, 
  limit: number, 
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

/**
 * Validates pagination options
 */
export function validatePaginationOptions(pagination: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!pagination) {
    errors.push('pagination: is required');
    return { isValid: false, errors };
  }

  const { page, limit } = pagination;
  
  if (typeof page !== 'number' || page < 1) {
    errors.push('page: must be a positive integer');
  }
  
  if (typeof limit !== 'number' || limit < 1 || limit > 100) {
    errors.push('limit: must be between 1 and 100');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Repository interface for entities that support query/list operations
 */
export interface QueryableRepository<TEntity, TFilters = any> {
  findMany(options?: {
    pagination?: PaginationOptions;
    filters?: TFilters;
  }): Promise<{ data: TEntity[]; total: number }>;
}
