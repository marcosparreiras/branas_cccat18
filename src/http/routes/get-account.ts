import type { Request, Response } from "express";
import pgPromise from "pg-promise";
import { AccountNotFountException } from "../exceptions/account-not-found-exception";
import { DomainException } from "../exceptions/domain-exception";

export async function getAccount(request: Request, response: Response) {
  const input = request.params;
  const databaseConnetion = pgPromise()(
    "postgres://postgres:123456@localhost:5432/app"
  );
  try {
    const queryResults = await databaseConnetion.query(
      `SELECT account_id, name, email, cpf, car_plate, is_passenger, is_driver, password
      FROM ccca.account
      WHERE account_id = $1`,
      [input.accountId]
    );
    if (queryResults.length === 0) {
      throw new AccountNotFountException(input.accountId);
    }
    return response.status(200).json({
      accountId: queryResults[0].account_id,
      name: queryResults[0].name,
      email: queryResults[0].email,
      cpf: queryResults[0].cpf,
      carPlate: queryResults[0].car_plate,
      isPassenger: queryResults[0].is_passenger,
      isDriver: queryResults[0].is_driver,
      password: queryResults[0].password,
    });
  } catch (error: unknown) {
    if (error instanceof DomainException) {
      return response.status(error.status).json({ message: error.message });
    }
    return response.status(500).send();
  } finally {
    await databaseConnetion.$pool.end();
  }
}
