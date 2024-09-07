import { DomainException } from "./domain-exception";

export class InvalidCpfException extends DomainException {
  constructor(cpf: string, status?: number) {
    super(`Invalid cpf (${cpf})`, status);
  }
}
