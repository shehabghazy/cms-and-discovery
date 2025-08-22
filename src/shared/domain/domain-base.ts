export abstract class DomainBase {
  public id: string;
  public created_at: Date;
  public updated_at: Date | null;

  constructor(id: string, created_at?: Date, updated_at?: Date | null) {
    this.id = id;
    this.created_at = created_at ?? new Date();
    this.updated_at = updated_at ?? null;
  }

  protected touch(): void {
    this.updated_at = new Date();
  }

  public equals(other: DomainBase): boolean {
    if (!(other instanceof DomainBase)) {
      return false;
    }
    return this.id === other.id;
  }

  public toObject(): Record<string, any> {
    return {
      id: this.id,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}
