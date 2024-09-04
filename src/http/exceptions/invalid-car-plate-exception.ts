import { DomainException } from "./domain-exception";

export class InvalidCarPlateException extends DomainException {
  constructor(carPlate: string, status?: number) {
    super(`Invalid car plate (${carPlate})`, status);
  }
}
