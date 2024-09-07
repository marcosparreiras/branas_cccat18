import { AccountAlreadyExistsException } from "../exceptions/account-already-exists-exception";
import { Account } from "../entities/account";
import type { AccountRepository } from "../repositories/account-repository";

type Input = {
  name: string;
  email: string;
  cpf: string;
  password: string;
  carPlate?: string;
  isDriver?: boolean;
  isPassenger?: boolean;
};

type Output = {
  accountId: string;
};

export class CreateAccountUseCase {
  constructor(private accountRepository: AccountRepository) {}

  async execute(input: Input): Promise<Output> {
    const accountAlreadyExists = await this.accountRepository.existsWithEmail(
      input.email
    );
    if (accountAlreadyExists) {
      throw new AccountAlreadyExistsException(input.email);
    }
    const account = Account.create({
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      password: input.password,
      carPlate: input.carPlate,
      isDriver: input.isDriver,
      isPassenger: input.isPassenger,
    });
    await this.accountRepository.create(account);
    return { accountId: account.getId() };
  }
}
