import { DomainException } from "./domain-exception";

export class InvalidEmailException extends DomainException {
  constructor(email: string, status?: number) {
    super(`Invalid email (${email})`, status);
  }
}
