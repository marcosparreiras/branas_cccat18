import { randomUUID } from "node:crypto";
import { ValidateService } from "./services/validate-service";
import { InvalidCarPlateException } from "../exceptions/invalid-car-plate-exception";
import { InvalidCpfException } from "../exceptions/invalid-cpf-exception";
import { InvalidEmailException } from "../exceptions/invalid-email-exception";
import { InvalidNameException } from "../exceptions/invalid-name-exception";

type CreateAccountDTO = {
  name: string;
  email: string;
  cpf: string;
  password: string;
  carPlate?: string;
  isDriver?: boolean;
  isPassenger?: boolean;
};

export class Account {
  private id: string;
  private name: string;
  private email: string;
  private cpf: string;
  private password: string;
  private carPlate: string | null;
  private _isDriver: boolean;
  private _isPassenger: boolean;

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getCpf(): string {
    return this.cpf;
  }

  public getPassword(): string {
    return this.password;
  }

  public getCarPlate(): string | null {
    return this.carPlate;
  }

  public isDriver(): boolean {
    return this._isDriver;
  }
  public isPassenger(): boolean {
    return this._isPassenger;
  }

  private constructor(
    id: string,
    name: string,
    email: string,
    cpf: string,
    password: string,
    carPlate: string | null,
    isDriver: boolean,
    isPassenger: boolean
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.password = password;
    this.carPlate = carPlate;
    this._isDriver = isDriver;
    this._isPassenger = isPassenger;
  }

  public static create(input: CreateAccountDTO): Account {
    if (!ValidateService.validateName(input.name)) {
      throw new InvalidNameException(input.name);
    }
    if (!ValidateService.validateEmail(input.email)) {
      throw new InvalidEmailException(input.email);
    }
    if (!ValidateService.validateCpf(input.cpf)) {
      throw new InvalidCpfException(input.cpf);
    }
    if (input.isDriver && !ValidateService.validateCarPlate(input.carPlate)) {
      throw new InvalidCarPlateException(input.carPlate ?? "null");
    }
    const id = randomUUID();
    return new Account(
      id,
      input.name,
      input.email,
      input.cpf,
      input.password,
      input.carPlate ?? null,
      !!input.isDriver,
      !!input.isPassenger
    );
  }
}
