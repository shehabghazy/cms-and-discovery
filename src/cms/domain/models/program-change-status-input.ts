import { ProgramStatus } from '../enums/index.js';
import { isEnumValue, DomainValidationError } from '../../../shared/utilities/index.js';

export type ProgramChangeStatusInput = {
  status: ProgramStatus.PUBLISHED | ProgramStatus.ARCHIVED;
  published_at?: Date; // automatically set to current timestamp when status = published
};

export function validateProgramChangeStatus(raw: ProgramChangeStatusInput, currentStatus: ProgramStatus) {
  const issues: Array<{ field: string; message: string }> = [];

  // Validate status transition rules
  if (currentStatus === ProgramStatus.PUBLISHED && raw.status !== ProgramStatus.PUBLISHED && raw.status !== ProgramStatus.ARCHIVED) {
    issues.push({ field: 'status', message: 'can only change from published to archived' });
  }
  
  if (currentStatus === ProgramStatus.ARCHIVED && raw.status !== ProgramStatus.ARCHIVED) {
    issues.push({ field: 'status', message: 'cannot change status once archived' });
  }

  if (!isEnumValue(ProgramStatus, raw.status)) {
    issues.push({ field: 'status', message: 'must be a valid status' });
  }

  if (raw.status !== ProgramStatus.PUBLISHED && raw.status !== ProgramStatus.ARCHIVED) {
    issues.push({ field: 'status', message: 'status must be published or archived' });
  }

  if (issues.length) throw new DomainValidationError(issues);

  return {
    status: raw.status,
    published_at: raw.status === ProgramStatus.PUBLISHED ? (raw.published_at || new Date()) : undefined
  } as const;
}
