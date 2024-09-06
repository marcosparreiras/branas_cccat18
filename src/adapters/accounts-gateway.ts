import type { DbConnection } from "./db-connection";

type CreateDTO = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  carPlate: string;
  isPassenger: boolean;
  isDriver: boolean;
  password: string;
};

export class AccountGateway {
  constructor(private dbConnection: DbConnection) {}

  async accountExistWithEmail(email: string): Promise<boolean> {
    const queryResult = await this.dbConnection.run(
      "SELECT account_id FROM ccca.account WHERE email = $1",
      [email]
    );
    return queryResult.length > 0;
  }

  async create(input: CreateDTO): Promise<void> {
    await this.dbConnection.run(
      `INSERT INTO ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) 
       VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        input.id,
        input.name,
        input.email,
        input.cpf,
        input.carPlate,
        input.isPassenger,
        input.isDriver,
        input.password,
      ]
    );
  }
}
