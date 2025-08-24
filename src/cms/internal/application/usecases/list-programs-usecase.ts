import { QueryListUseCase, QueryListResult, PaginationMeta } from '../../../../shared/index.js';
import type { ProgramDto } from '../contracts/create-program-contract.js';
import { Program, type ProgramRepository } from '../../domain/index.js';
import { toProgramDto } from '../mappers/program-mapper.js';
import { 
  ListProgramsInput, 
  ListProgramsFilters 
} from '../../domain/models/list-programs-input.js';

export type ListProgramsOutput = { 
  programs: ProgramDto[];
  pagination: PaginationMeta;
};

export class ListProgramsUseCase extends QueryListUseCase<Program, ProgramDto, ListProgramsFilters> {
  constructor(programRepository: ProgramRepository) {
    super(programRepository);
  }

  protected validateFilters(filters: ListProgramsFilters): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    const { status, type, search } = filters;
    
    if (status && !['draft', 'published', 'archived'].includes(status)) {
      errors.push('status: must be one of draft, published, archived');
    }
    
    if (type && !['podcast', 'course', 'series'].includes(type)) {
      errors.push('type: must be one of podcast, course, series');
    }
    
    if (search && (typeof search !== 'string' || search.length === 0 || search.length > 100)) {
      errors.push('search: must be a non-empty string with max 100 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  protected mapToDto(program: Program): ProgramDto {
    return toProgramDto(program);
  }

  // Public method for API compatibility that transforms the result
  async executeForApi(input: ListProgramsInput): Promise<ListProgramsOutput> {
    const result = await super.execute(input);
    
    // Transform result.data to result.programs for backward compatibility
    return {
      programs: result.data,
      pagination: result.pagination
    };
  }
}
