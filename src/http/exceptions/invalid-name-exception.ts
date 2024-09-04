import { DomainException } from "./domain-exception";

export class InvalidNameException extends DomainException {
  constructor(name: string, status?: number) {
    super(`Invalid name (${name})`, status);
  }
}
