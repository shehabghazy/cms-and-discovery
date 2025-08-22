import { 
  QueryListInput, 
  validatePaginationOptions 
} from '../../../shared/application/pagination-query/query-list.js';

export interface ListEpisodesFilters {
  status?: 'draft' | 'published' | 'hidden';
  kind?: 'audio' | 'video';
  program_id?: string;
  search?: string;
}

export interface ListEpisodesInput extends QueryListInput<ListEpisodesFilters> {}

export function validateListEpisodesInput(input: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate pagination using shared utility
  const paginationValidation = validatePaginationOptions(input.pagination);
  if (!paginationValidation.isValid) {
    errors.push(...paginationValidation.errors);
  }

  // Validate filters if provided
  if (input.filters) {
    const { status, kind, program_id, search } = input.filters;
    
    if (status && !['draft', 'published', 'hidden'].includes(status)) {
      errors.push('status: must be one of draft, published, hidden');
    }
    
    if (kind && !['audio', 'video'].includes(kind)) {
      errors.push('kind: must be one of audio, video');
    }
    
    if (program_id && (typeof program_id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(program_id))) {
      errors.push('program_id: must be a valid UUID');
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
