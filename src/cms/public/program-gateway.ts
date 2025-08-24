import { ProgramDto, ProgramSummaryDto } from './dtos/program-dto.js';
import { ProgramStatus } from './dtos/enums.js';

/**
 * Public interface for accessing Program data
 * This is what other modules can depend on
 */
export interface PublicProgramRepository {
  /**
   * Find a published program by its ID
   */
  findPublishedById(id: string): Promise<ProgramDto | null>;

  /**
   * Find a published program by its slug
   */
  findPublishedBySlug(slug: string): Promise<ProgramDto | null>;

  /**
   * List published programs with pagination
   */
  listPublished(options?: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<{
    data: ProgramSummaryDto[];
    total: number;
    page: number;
    limit: number;
  }>;
}
