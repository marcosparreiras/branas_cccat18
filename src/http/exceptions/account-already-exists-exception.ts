import { DomainException } from "./domain-exception";

export class AccountAlreadyExistsException extends DomainException {
  constructor(email: string, status?: number) {
    super(`Account with email (${email}) already exists`, status);
  }
}
