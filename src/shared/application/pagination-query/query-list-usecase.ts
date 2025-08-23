import { QueryUseCase } from '../usecases/query-usecase.js';
import { 
  QueryListInput, 
  QueryListResult, 
  PaginationMeta,
  QueryableRepository,
  createPaginationMeta,
  validatePaginationOptions
} from './query-list.js';
import { ValidationError } from '../usecase-errors.js';

/**
 * Base class for list/query use cases that provides common pagination and filtering logic
 */
export abstract class QueryListUseCase<
  TEntity,
  TDto,
  TFilters = any
> extends QueryUseCase<QueryListInput<TFilters>, QueryListResult<TDto>> {

  constructor(protected readonly repository: QueryableRepository<TEntity, TFilters>) {
    super();
  }

  async execute(input: QueryListInput<TFilters>): Promise<QueryListResult<TDto>> {
    // Validate pagination
    const paginationValidation = validatePaginationOptions(input.pagination);
    if (!paginationValidation.isValid) {
      throw new ValidationError(paginationValidation.errors.join(', '));
    }

    // Validate filters if provided
    if (input.filters) {
      const filtersValidation = this.validateFilters(input.filters);
      if (!filtersValidation.isValid) {
        throw new ValidationError(filtersValidation.errors.join(', '));
      }
    }

    // Set defaults for pagination
    const pagination = {
      page: input.pagination?.page || 1,
      limit: input.pagination?.limit || 10
    };

    try {
      // Query repository
      const result = await this.repository.findMany({
        pagination,
        filters: input.filters
      });

      // Create pagination metadata
      const paginationMeta = createPaginationMeta(
        pagination.page,
        pagination.limit,
        result.total
      );

      // Map domain entities to DTOs
      const dtos = result.data.map(entity => this.mapToDto(entity));

      return {
        data: dtos,
        pagination: paginationMeta
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Failed to list entities: ${error}`);
    }
  }

  /**
   * Override this method to provide custom filter validation
   */
  protected validateFilters(filters: TFilters): { isValid: boolean; errors: string[] } {
    return { isValid: true, errors: [] };
  }

  /**
   * Override this method to map domain entities to DTOs
   */
  protected abstract mapToDto(entity: TEntity): TDto;
}
