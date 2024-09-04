import { DomainException } from "./domain-exception";

export class AccountNotFountException extends DomainException {
  constructor(accountId: string, status?: number) {
    super(`Account (${accountId}) not found`, status);
  }
}
