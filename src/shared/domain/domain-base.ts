export abstract class DomainBase {
  public readonly id: string;
  public created_at: Date;
  public updated_at: Date | null;

  constructor(id: string) {
    this.id = id;
    this.created_at = new Date();
    this.updated_at = null;
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
