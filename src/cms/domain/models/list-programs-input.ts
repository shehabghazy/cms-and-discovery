import { 
  QueryListInput, 
  validatePaginationOptions 
} from '../../../shared/application/pagination-query/query-list.js';

export interface ListProgramsFilters {
  status?: 'draft' | 'published' | 'archived';
  type?: 'podcast' | 'course' | 'series';
  search?: string;
}

export interface ListProgramsInput extends QueryListInput<ListProgramsFilters> {}

export function validateListProgramsInput(input: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate pagination using shared utility
  const paginationValidation = validatePaginationOptions(input.pagination);
  if (!paginationValidation.isValid) {
    errors.push(...paginationValidation.errors);
  }

  // Validate filters if provided
  if (input.filters) {
    const { status, type, search } = input.filters;
    
    if (status && !['draft', 'published', 'archived'].includes(status)) {
      errors.push('status: must be one of draft, published, archived');
    }
    
    if (type && !['podcast', 'course', 'series'].includes(type)) {
      errors.push('type: must be one of podcast, course, series');
    }
    
    if (search && (typeof search !== 'string' || search.length === 0 || search.length > 100)) {
      errors.push('search: must be a non-empty string with max 100 characters');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

