import { DomainBase } from '../../shared/abstractions/DomainBase.js';
import { Language } from './enums/index.js';
import { 
  type EpisodeMetadata,
  validateEpisodeCreate,
  validateEpisodeUpdate,
  type EpisodeCreateInput,
  type EpisodeUpdateInput
} from './models/index.js';

export class Episode extends DomainBase {
  public program_id: string;
  public title: string;
  public description: string;
  public language: Language;
  public duration_s: number;
  public published_at: Date | null;
  public source_url: string | null;
  public metadata: EpisodeMetadata;

  private constructor(props: ReturnType<typeof validateEpisodeCreate>) {
    super(props.id);
    this.program_id = props.program_id;
    this.title = props.title;
    this.description = props.description;
    this.language = props.language;
    this.duration_s = props.duration_s;
    this.published_at = props.published_at;
    this.source_url = props.source_url;
    this.metadata = props.metadata;
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
    if (upd.language !== undefined) this.language = upd.language;
    if (upd.duration_s !== undefined) this.duration_s = upd.duration_s;
    if ('source_url' in diff) this.source_url = upd.source_url ?? null;
    if (upd.metadata !== undefined) this.metadata = { ...this.metadata, ...upd.metadata };

    this.touch();
  }

  public setMetadata(key: string, value: unknown): void {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') return;
    this.metadata = { ...this.metadata, [key]: value };
    this.touch();
  }

  public unsetMetadata(key: string): void {
    if (key in this.metadata) {
      const { [key]: _, ...rest } = this.metadata;
      this.metadata = rest;
      this.touch();
    }
  }

  public getMetadata(key: string): unknown {
    return this.metadata[key];
  }

  public getFormattedDuration(): string {
    const h = Math.floor(this.duration_s / 3600);
    const m = Math.floor((this.duration_s % 3600) / 60);
    const s = this.duration_s % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }
}
