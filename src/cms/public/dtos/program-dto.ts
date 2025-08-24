import { ProgramType, ProgramStatus } from './enums.js';

/**
 * Public DTO for Program entity
 * This is the contract that other modules can depend on
 */
export interface ProgramDto {
  id: string;
  title: string;
  type: ProgramType;
  slug: string;
  status: ProgramStatus;
  description: string | null;
  cover: string | null; // asset_id
  language: string;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Minimal program data for list views
 */
export interface ProgramSummaryDto {
  id: string;
  title: string;
  slug: string;
  status: ProgramStatus;
  cover: string | null;
  published_at: Date | null;
}
