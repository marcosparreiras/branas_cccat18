export class DomainException extends Error {
  readonly status: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status ?? 400;
  }
}
