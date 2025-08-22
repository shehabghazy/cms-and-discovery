// application/mappers/program.mapper.ts
import { Program } from '../../domain/program.js';
import type { ProgramDto } from '../contracts/create-program-contract.js';

export const toProgramDto = (program: Program): ProgramDto => ({
  id: program.id,
  title: program.title,
  type: program.type,
  slug: program.slug,
  status: program.status,
  description: program.description,
  cover: program.cover,
  language: program.language,
  published_at: program.published_at?.toISOString() ?? null,
  created_at: program.created_at.toISOString(),
  updated_at: program.updated_at?.toISOString() ?? null,
});

export const toProgramDtoArray = (programs: Program[]): ProgramDto[] => 
  programs.map(toProgramDto);
