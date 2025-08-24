import { isUuid, DomainValidationError } from "../../../../shared/utilities/index.js";

export interface AssetDownloadInput {
  id: string;
}

export function validateAssetDownload(input: AssetDownloadInput) {
  const issues: Array<{ field: string; message: string }> = [];

  if (!isUuid(input.id)) {
    issues.push({ field: 'id', message: 'must be a valid UUID' });
  }

  if (issues.length > 0) {
    throw new DomainValidationError(issues);
  }

  return { id: input.id };
}
