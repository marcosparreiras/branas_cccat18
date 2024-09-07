import { type Request, type Response } from "express";
import { DomainException } from "../../domain/exceptions/domain-exception";
import { PgConnection } from "../../adapters/db-connection";
import { DbAccountRepository } from "../../adapters/db-accounts-repository";
import { CreateAccountUseCase } from "../../domain/use-cases/create-account-use-case";

export async function signup(request: Request, response: Response) {
  const input = request.body;
  const databaseConnection = new PgConnection(
    process.env.DATABASE_URL as string
  );
  const accountRepository = new DbAccountRepository(databaseConnection);
  const createAccountUseCase = new CreateAccountUseCase(accountRepository);
  try {
    const { accountId } = await createAccountUseCase.execute({
      email: input.email,
      cpf: input.cpf,
      name: input.name,
      password: input.password,
      carPlate: input.carPlate,
      isDriver: input.isDriver,
      isPassenger: input.isPassenger,
    });
    return response.status(201).json({ accountId });
  } catch (error: unknown) {
    if (error instanceof DomainException) {
      return response.status(error.status).send({ message: error.message });
    }
    return response.status(500).send();
  } finally {
    await databaseConnection.end();
  }
}
