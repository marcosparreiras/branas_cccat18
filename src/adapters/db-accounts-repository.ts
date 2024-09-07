import type { Account } from "../domain/entities/account";
import type { AccountRepository } from "../domain/repositories/account-repository";
import type { DbConnection } from "./db-connection";

export class DbAccountRepository implements AccountRepository {
  constructor(private dbConnection: DbConnection) {}

  async existsWithEmail(email: string): Promise<boolean> {
    const queryResult = await this.dbConnection.run(
      "SELECT account_id FROM ccca.account WHERE email = $1",
      [email]
    );
    return queryResult.length > 0;
  }

  async create(account: Account): Promise<void> {
    await this.dbConnection.run(
      `INSERT INTO ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) 
       VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        account.getId(),
        account.getName(),
        account.getEmail(),
        account.getCpf(),
        account.getCarPlate(),
        account.isPassenger(),
        account.isDriver(),
        account.getPassword(),
      ]
    );
  }
}
