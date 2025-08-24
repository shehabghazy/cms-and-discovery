import { DomainBase } from '../../shared/domain/domain-base.js';
import { EpisodeKind, EpisodeStatus } from './enums/index.js';
import { 
  validateEpisodeCreate,
  validateEpisodeUpdate,
  validateEpisodeChangeStatus,
  validateEpisodeMoveToProgram,
  type EpisodeCreateInput,
  type EpisodeUpdateInput,
  type EpisodeChangeStatusInput,
  type EpisodeMoveToProgram
} from './models/index.js';
import { EpisodePublishedEvent, EpisodeHiddenEvent } from './events/index.js';

export class Episode extends DomainBase {
  public program_id: string;
  public title: string;
  public slug: string;
  public description: string | null;
  public cover: string | null; // asset_id
  public transcripts: string[]; // list of asset_id UUIDs
  public status: EpisodeStatus;
  public published_at: Date | null;
  public kind: EpisodeKind;
  public source: string; // asset_id

  private constructor(props: ReturnType<typeof validateEpisodeCreate>) {
    super(props.id, props.created_at, props.updated_at);
    this.program_id = props.program_id;
    this.title = props.title;
    this.slug = props.slug;
    this.description = props.description;
    this.cover = props.cover;
    this.transcripts = props.transcripts;
    this.status = props.status;
    this.published_at = props.published_at;
    this.kind = props.kind;
    this.source = props.source;
  }

  /** Domain-level factory with domain validation */
  public static create(input: EpisodeCreateInput): Episode {
    const props = validateEpisodeCreate(input); // throws DomainValidationError if invalid
    return new Episode(props);
  }

  /** Apply a diff; domain validation is executed in the validator to keep this method tidy. */
  public update(diff: EpisodeUpdateInput): void {
    const upd = validateEpisodeUpdate(diff); // throws DomainValidationError if invalid

    if (upd.title !== undefined) this.title = upd.title;
    if (upd.description !== undefined) this.description = upd.description;
    if (upd.cover !== undefined) this.cover = upd.cover;
    if (upd.transcripts !== undefined) this.transcripts = upd.transcripts;

    this.touch();
  }

  /** Change status with automatic published_at handling */
  public changeStatus(input: EpisodeChangeStatusInput): void {
    const previousStatus = this.status;
    const statusChange = validateEpisodeChangeStatus(input, this.status); // throws DomainValidationError if invalid

    this.status = statusChange.status;
    
    // Handle published_at logic
    if (statusChange.status === EpisodeStatus.PUBLISHED && this.published_at === null) {
      this.published_at = statusChange.published_at || new Date();
    }
    // Note: published_at is kept when hiding (as history)
    // Note: once published, status cannot go back to draft

    this.touch();

    // Emit EpisodePublishedEvent when episode is published
    if (previousStatus !== EpisodeStatus.PUBLISHED && this.status === EpisodeStatus.PUBLISHED) {
      this.addDomainEvent(new EpisodePublishedEvent({
        episodeId: this.id,
        programId: this.program_id,
        slug: this.slug,
        title: this.title,
        description: this.description,
        kind: this.kind,
        publishedAt: this.published_at!, // We know it's not null since we just set it above
      }));
    }

    // Emit EpisodeHiddenEvent when episode is hidden
    if (this.status === EpisodeStatus.HIDDEN) {
      this.addDomainEvent(new EpisodeHiddenEvent({
        episodeId: this.id,
      }));
    }
  }

  /** Move episode to another program with slug uniqueness validation */
  public moveToProgram(input: EpisodeMoveToProgram): void {
    const moveData = validateEpisodeMoveToProgram(input); // throws DomainValidationError if invalid

    this.program_id = moveData.program_id;
    this.slug = moveData.slug;

    this.touch();
  }

  /** Override toObject to include all Episode properties */
  public toObject(): Record<string, any> {
    return {
      ...super.toObject(),
      program_id: this.program_id,
      title: this.title,
      slug: this.slug,
      description: this.description,
      cover: this.cover,
      transcripts: this.transcripts,
      status: this.status,
      published_at: this.published_at,
      kind: this.kind,
      source: this.source
    };
  }
}
