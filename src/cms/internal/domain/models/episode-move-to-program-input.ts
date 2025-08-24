import { isUuid, isValidSlug, DomainValidationError } from '../../../../shared/utilities/index.js';

export type EpisodeMoveToProgram = {
  program_id: string;
  slug: string;
};

export function validateEpisodeMoveToProgram(raw: EpisodeMoveToProgram) {
  const issues: Array<{ field: string; message: string }> = [];

  if (!isUuid(raw.program_id)) {
    issues.push({ field: 'program_id', message: 'must be a valid UUID' });
  }

  if (!isValidSlug(raw.slug)) {
    issues.push({ field: 'slug', message: 'must be a valid slug (lowercase letters, numbers, hyphens only, max 80 chars)' });
  }

  if (issues.length) throw new DomainValidationError(issues);

  return {
    program_id: raw.program_id,
    slug: raw.slug.trim()
  } as const;
}
