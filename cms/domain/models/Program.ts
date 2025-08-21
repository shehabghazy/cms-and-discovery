import { ProgramType, ProgramStatus } from '../enums/index.js';
import { isUuid, isNonEmpty, isValidSlug, isEnumValue, DomainValidationError } from '../../../shared/utilities/index.js';

export type ProgramCreateInput = {
  id: string;
  title: string;
  type: ProgramType;
  slug: string;
  status?: ProgramStatus;
  created_at?: Date;
  updated_at?: Date | null;
};

export type ProgramUpdateInput = {
  title?: string;
  type?: ProgramType;
  slug?: string;
  status?: ProgramStatus;
};

export function validateProgramCreate(raw: ProgramCreateInput) {
  const issues: Array<{ field: string; message: string }> = [];

  if (!isUuid(raw.id)) issues.push({ field: 'id', message: 'must be a UUID' });

  if (!isNonEmpty(raw.title)) {
    issues.push({ field: 'title', message: 'must be non-empty' });
  } else if (raw.title.trim().length > 200) {
    issues.push({ field: 'title', message: 'must be 200 characters or less' });
  }

  if (!isEnumValue(ProgramType, raw.type)) {
    issues.push({ field: 'type', message: 'must be a valid ProgramType' });
  }

  if (!isValidSlug(raw.slug)) {
    issues.push({ field: 'slug', message: 'must be a valid slug (lowercase letters, numbers, hyphens only, max 100 chars)' });
  }

  if (raw.status && !isEnumValue(ProgramStatus, raw.status)) {
    issues.push({ field: 'status', message: 'must be a valid ProgramStatus' });
  }

  if (issues.length) throw new DomainValidationError(issues);

  return {
    id: raw.id,
    title: raw.title.trim(),
    type: raw.type,
    slug: raw.slug.trim(),
    status: raw.status ?? ProgramStatus.DRAFT,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  } as const;
}

export function validateProgramUpdate(raw: ProgramUpdateInput) {
  const issues: Array<{ field: string; message: string }> = [];

  const out: ProgramUpdateInput = {};

  if ('title' in raw && raw.title !== undefined) {
    if (!isNonEmpty(raw.title)) {
      issues.push({ field: 'title', message: 'must be non-empty' });
    } else if (raw.title.trim().length > 200) {
      issues.push({ field: 'title', message: 'must be 200 characters or less' });
    } else {
      out.title = raw.title.trim();
    }
  }

  if ('type' in raw && raw.type !== undefined) {
    if (!isEnumValue(ProgramType, raw.type)) {
      issues.push({ field: 'type', message: 'must be a valid ProgramType' });
    } else {
      out.type = raw.type;
    }
  }

  if ('slug' in raw && raw.slug !== undefined) {
    if (!isValidSlug(raw.slug)) {
      issues.push({ field: 'slug', message: 'must be a valid slug (lowercase letters, numbers, hyphens only, max 100 chars)' });
    } else {
      out.slug = raw.slug.trim();
    }
  }

  if ('status' in raw && raw.status !== undefined) {
    if (!isEnumValue(ProgramStatus, raw.status)) {
      issues.push({ field: 'status', message: 'must be a valid ProgramStatus' });
    } else {
      out.status = raw.status;
    }
  }

  if (issues.length) throw new DomainValidationError(issues);

  return out;
}
