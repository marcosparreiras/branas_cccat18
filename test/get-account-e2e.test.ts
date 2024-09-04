import { randomUUID } from "node:crypto";
import { app } from "../src/http/app";
import request from "supertest";

import pgp from "pg-promise";

describe("GET /account", () => {
  const databaseConnetion = pgp()(
    "postgres://postgres:123456@localhost:5432/app"
  );

  beforeEach(async () => {
    await databaseConnetion.query("DELETE FROM ccca.account");
  });

  afterAll(async () => {
    await databaseConnetion.query("DELETE FROM ccca.account");
    await databaseConnetion.$pool.end();
  });

  it("Should be able to get an existent account", async () => {
    const account = {
      accountId: randomUUID(),
      name: "John Doe",
      email: "johndoe@example.com",
      cpf: "00000000000",
      carPlate: "PXG2020",
      isPassenger: false,
      isDriver: true,
      password: "123456",
    };
    await databaseConnetion.query(
      `INSERT INTO 
      ccca.account(account_id, name, email, cpf, car_plate, is_passenger, is_driver, password)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        account.accountId,
        account.name,
        account.email,
        account.cpf,
        account.carPlate,
        account.isPassenger,
        account.isDriver,
        account.password,
      ]
    );
    const httpResponse = await request(app).get(
      `/account/${account.accountId}`
    );
    expect(httpResponse.status).toEqual(200);
    expect(httpResponse.body).toEqual(expect.objectContaining(account));
  });

  it("Should not be able to get an account with an invalid id", async () => {
    const httpResponse = await request(app).get(`/account/${randomUUID()}`);
    expect(httpResponse.status).toEqual(400);
  });
});
