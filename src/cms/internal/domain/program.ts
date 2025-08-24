import { DomainBase } from '../../../shared/domain/domain-base.js';
import { ProgramType, ProgramStatus } from './enums/index.js';
import { 
  validateProgramCreate,
  validateProgramUpdate,
  validateProgramChangeStatus,
  type ProgramCreateInput,
  type ProgramUpdateInput,
  type ProgramChangeStatusInput
} from './models/index.js';
import { ProgramPublishedEvent, ProgramArchivedEvent, ProgramStatusChangedEvent } from './events/index.js';
import { ProgramStatusChangeStrategyRegistry } from './strategies/index.js';

export class Program extends DomainBase {
  public title: string;
  public type: ProgramType;
  public slug: string;
  public status: ProgramStatus;
  public description: string | null;
  public cover: string | null; // asset_id
  public language: string;
  public published_at: Date | null;

  private constructor(props: ReturnType<typeof validateProgramCreate>) {
    super(props.id, props.created_at, props.updated_at);
    this.title = props.title;
    this.type = props.type;
    this.slug = props.slug;
    this.status = props.status;
    this.description = props.description;
    this.cover = props.cover;
    this.language = props.language;
    this.published_at = props.published_at;
  }

  /** Domain-level factory with domain validation */
  public static create(input: ProgramCreateInput): Program {
    const props = validateProgramCreate(input); // throws DomainValidationError if invalid
    return new Program(props);
  }

  /** Apply a diff; domain validation is executed in the validator to keep this method tidy. */
  public update(diff: ProgramUpdateInput): void {
    const upd = validateProgramUpdate(diff); // throws DomainValidationError if invalid

    if (upd.title !== undefined) this.title = upd.title;
    if (upd.type !== undefined) this.type = upd.type;
    if (upd.description !== undefined) this.description = upd.description;
    if (upd.cover !== undefined) this.cover = upd.cover;
    if (upd.language !== undefined) this.language = upd.language;

    this.touch();
  }

  /** Change status with automatic published_at handling */
  public changeStatus(input: ProgramChangeStatusInput): void {
    const previousStatus = this.status;
    const statusChange = validateProgramChangeStatus(input, this.status); // throws DomainValidationError if invalid

    // Early return if status is the same - no need to enter strategies
    if (statusChange.status === previousStatus) {
      return;
    }

    this.status = statusChange.status;

    this.touch();

    // Use strategy pattern to handle status-specific logic (only for statuses that have strategies)
    const strategy = ProgramStatusChangeStrategyRegistry.getStrategy(this.status);
    strategy.handleStatusChange(
      {
        id: this.id,
        slug: this.slug,
        title: this.title,
        description: this.description,
        type: this.type,
        language: this.language,
        published_at: this.published_at,
      },
      (event) => this.addDomainEvent(event),
      (date) => { this.published_at = date; }
    );

  }
}
