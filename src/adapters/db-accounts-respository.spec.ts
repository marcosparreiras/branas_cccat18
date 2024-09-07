import { Account } from "../domain/entities/account";
import { DbAccountRepository } from "./db-accounts-repository";
import { PgConnection, type DbConnection } from "./db-connection";

describe("DbAccountsRepository", () => {
  let dbConnection: DbConnection;
  let dbAccountRepository: DbAccountRepository;

  beforeAll(() => {
    dbConnection = new PgConnection(process.env.DATABASE_URL as string);
    dbAccountRepository = new DbAccountRepository(dbConnection);
  });

  beforeEach(async () => {
    await dbConnection.run("DELETE FROM ccca.account");
  });

  afterAll(async () => {
    await dbConnection.run("DELETE FROM ccca.account");
    await dbConnection.end();
  });

  it("Should be able to validate that exists an account with an given email", async () => {
    const email = "johndoe@example.com";
    await dbConnection.run(
      `INSERT INTO 
      ccca.account(account_id, name, email, cpf, car_plate, is_passenger, is_driver, password)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        "ef181ed1-4181-423c-a030-d5c8921112ec",
        "John Doe",
        email,
        "99999999999",
        "JDW4523",
        false,
        true,
        "123465$Is",
      ]
    );
    const accountExists = await dbAccountRepository.existsWithEmail(email);
    expect(accountExists).toBe(true);
  });

  it("Should be able to that do not exists an account with a given email", async () => {
    const accountExists = await dbAccountRepository.existsWithEmail(
      "janydoe@example.com"
    );
    expect(accountExists).toBe(false);
  });

  it("Should be able to persist a new account", async () => {
    const createAccountDTO = {
      email: "johndoe@example.com",
      cpf: "97456321558",
      name: "John Doe",
      password: "123456$Io",
      isPassenger: true,
    };
    const account = Account.create(createAccountDTO);
    await dbAccountRepository.create(account);
    const queryResult = await dbConnection.run(
      "SELECT * FROM ccca.account WHERE account_id = $1",
      [account.getId()]
    );
    const accountOnRepository = queryResult[0];
    expect(accountOnRepository.name).toEqual(createAccountDTO.name);
    expect(accountOnRepository.email).toEqual(createAccountDTO.email);
    expect(accountOnRepository.cpf).toEqual(createAccountDTO.cpf);
    expect(accountOnRepository.is_passenger).toEqual(
      createAccountDTO.isPassenger
    );
  });
});
