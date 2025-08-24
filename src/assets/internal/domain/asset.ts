import { DomainBase } from "../../../shared/domain/domain-base.js";
import {
  validateAssetCreate,
  validateAssetUpdateAvailability,
  type AssetCreateInput,
  type AssetUpdateAvailabilityInput
} from './models/index.js';

export class Asset extends DomainBase {
  public name: string;
  public storage_key: string;
  public extension: string;
  public size: number;
  public last_access: Date | null;
  public is_available: boolean;

  private constructor(props: ReturnType<typeof validateAssetCreate>) {
    super(props.id, props.created_at, props.updated_at);
    this.name = props.name;
    this.storage_key = props.storage_key;
    this.extension = props.extension;
    this.size = props.size;
    this.last_access = props.last_access;
    this.is_available = props.is_available;
  }

  /** Domain-level factory with domain validation */
  public static create(input: AssetCreateInput): Asset {
    const props = validateAssetCreate(input); // throws DomainValidationError if invalid
    return new Asset(props);
  }

  /** Update availability with domain validation */
  public updateAvailability(input: AssetUpdateAvailabilityInput): void {
    const update = validateAssetUpdateAvailability(input); // throws DomainValidationError if invalid
    this.is_available = update.is_available;
    this.touch();
  }

  /** Record access time when asset is successfully downloaded */
  public recordAccess(): void {
    this.last_access = new Date();
    this.touch();
  }

  /** Override toObject to include asset-specific properties */
  public toObject(): Record<string, any> {
    return {
      ...super.toObject(),
      name: this.name,
      storage_key: this.storage_key,
      extension: this.extension,
      size: this.size,
      last_access: this.last_access,
      is_available: this.is_available
    };
  }
}
