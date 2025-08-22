import { DomainBase } from '../../shared/domain/domain-base.js';
import { ProgramType, ProgramStatus } from './enums/index.js';
import { 
  validateProgramCreate,
  validateProgramUpdate,
  type ProgramCreateInput,
  type ProgramUpdateInput
} from './models/index.js';

export class Program extends DomainBase {
  public title: string;
  public type: ProgramType;
  public slug: string;
  public status: ProgramStatus;

  private constructor(props: ReturnType<typeof validateProgramCreate>) {
    super(props.id, props.created_at, props.updated_at);
    this.title = props.title;
    this.type = props.type;
    this.slug = props.slug;
    this.status = props.status;
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
    if (upd.slug !== undefined) this.slug = upd.slug;
    if (upd.status !== undefined) this.status = upd.status;

    this.touch();
  }


}
