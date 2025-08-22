import { EpisodeStatus } from '../enums/index.js';
import { isEnumValue, DomainValidationError } from '../../../shared/utilities/index.js';

export type EpisodeChangeStatusInput = {
  status: EpisodeStatus.PUBLISHED | EpisodeStatus.HIDDEN;
  published_at?: Date; // automatically set to current timestamp when status = published
};

export function validateEpisodeChangeStatus(raw: EpisodeChangeStatusInput, currentStatus: EpisodeStatus) {
  const issues: Array<{ field: string; message: string }> = [];

  // Validate status transition rules
  // Once published or hidden, cannot go back to draft
  if (currentStatus === EpisodeStatus.PUBLISHED || currentStatus === EpisodeStatus.HIDDEN) {
    // Already published or hidden, only allow published or hidden states
    if (raw.status !== EpisodeStatus.PUBLISHED && raw.status !== EpisodeStatus.HIDDEN) {
      issues.push({ field: 'status', message: 'status cannot be draft again after publish or hidden' });
    }
  }

  if (!isEnumValue(EpisodeStatus, raw.status)) {
    issues.push({ field: 'status', message: 'must be a valid status' });
  }

  if (raw.status !== EpisodeStatus.PUBLISHED && raw.status !== EpisodeStatus.HIDDEN) {
    issues.push({ field: 'status', message: 'status must be published or hidden' });
  }

  if (issues.length) throw new DomainValidationError(issues);

  return {
    status: raw.status,
    published_at: raw.status === EpisodeStatus.PUBLISHED ? (raw.published_at || new Date()) : undefined
  } as const;
}
