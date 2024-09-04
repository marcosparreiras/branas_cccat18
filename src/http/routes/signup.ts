import crypto from "crypto";
import pgp from "pg-promise";
import { type Request, type Response } from "express";
import { validateCpf } from "../../utils/validateCpf";
import { AccountAlreadyExistsException } from "../exceptions/account-already-exists-exception";
import { DomainException } from "../exceptions/domain-exception";
import { InvalidNameException } from "../exceptions/invalid-name-exception";
import { InvalidEmailException } from "../exceptions/invalid-email-exception";
import { InvalidCpfException } from "../exceptions/invalid-cpf-exception";
import { InvalidCarPlateException } from "../exceptions/invalid-car-plate-exception";

export async function signup(request: Request, response: Response) {
  const input = request.body;
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  try {
    const [accountAlreadyExists] = await connection.query(
      "SELECT * FROM ccca.account WHERE email = $1",
      [input.email]
    );
    if (accountAlreadyExists) {
      throw new AccountAlreadyExistsException(input.email);
    }
    if (!validateName(input.name)) {
      throw new InvalidNameException(input.name);
    }
    if (!validateEmail(input.email)) {
      throw new InvalidEmailException(input.email);
    }
    if (!validateCpf(input.cpf)) {
      throw new InvalidCpfException(input.cpf);
    }
    if (input.isDriver && !validateCarPlate(input.carPlate)) {
      throw new InvalidCarPlateException(input.carPlate);
    }
    const id = crypto.randomUUID();
    await connection.query(
      `INSERT INTO ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) 
       VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        id,
        input.name,
        input.email,
        input.cpf,
        input.carPlate,
        !!input.isPassenger,
        !!input.isDriver,
        input.password,
      ]
    );
    return response.status(201).json({ accountId: id });
  } catch (error: unknown) {
    if (error instanceof DomainException) {
      return response.status(422).send({ message: error.message });
    }
    return response.status(500).send();
  } finally {
    await connection.$pool.end();
  }
}

function validateName(name: string): boolean {
  return /[a-zA-Z] [a-zA-Z]+/.test(name);
}

function validateEmail(email: string): boolean {
  return /^(.+)@(.+)$/.test(email);
}

function validateCarPlate(carPlate: string): boolean {
  return /[A-Z]{3}[0-9]{4}/.test(carPlate);
}
