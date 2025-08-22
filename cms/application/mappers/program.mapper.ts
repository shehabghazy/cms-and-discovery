// application/mappers/program.mapper.ts
import { Program } from '../../domain/Program.js';
import type { ProgramDto } from '../contracts/program.contract.js';

export const toProgramDto = (p: Program): ProgramDto => ({
  id: p.id,
  title: p.title,
  type: p.type,
  slug: p.slug,
  status: p.status,
  created_at: p.created_at.toISOString(),
  updated_at: p.updated_at ? p.updated_at.toISOString() : null,
});
