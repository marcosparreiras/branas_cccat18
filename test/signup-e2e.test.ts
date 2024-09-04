import { randomUUID } from "node:crypto";
import { app } from "../src/http/app";
import request from "supertest";

import pgp from "pg-promise";

describe("POST /signup", () => {
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

  it("Should be able to create an passenger", async () => {
    const requestBody = {
      name: "John Doe",
      email: "johndoe@example.com",
      cpf: "97456321558",
      password: "123456A@p",
      isPassenger: true,
      isDriver: false,
    };
    const signupHttpResponse = await request(app)
      .post("/signup")
      .send(requestBody);
    expect(signupHttpResponse.status).toEqual(201);
    expect(signupHttpResponse.body).toEqual(
      expect.objectContaining({
        accountId: expect.any(String),
      })
    );
    const accountId = signupHttpResponse.body.accountId;
    const getAccountHttpResponse = await request(app).get(
      `/account/${accountId}`
    );
    expect(getAccountHttpResponse.status).toEqual(200);
    expect(getAccountHttpResponse.body).toEqual(
      expect.objectContaining(requestBody)
    );
  });

  it("Should be able to create a driver", async () => {
    const requestBody = {
      name: "John Doe",
      email: "johndoe@example.com",
      cpf: "97456321558",
      carPlate: "PXG5050",
      password: "123456A@p",
      isPassenger: false,
      isDriver: true,
    };
    const signupHttpResponse = await request(app)
      .post("/signup")
      .send(requestBody);
    expect(signupHttpResponse.status).toEqual(201);
    expect(signupHttpResponse.body).toEqual(
      expect.objectContaining({
        accountId: expect.any(String),
      })
    );
    const accountId = signupHttpResponse.body.accountId;
    const getAccountHttpResponse = await request(app).get(
      `/account/${accountId}`
    );
    expect(getAccountHttpResponse.status).toEqual(200);
    expect(getAccountHttpResponse.body).toEqual(
      expect.objectContaining(requestBody)
    );
  });

  it("Should not be able to create an account with an invalid cpf", async () => {
    const requestBody = {
      name: "John Doe",
      email: "johndoe@example.com",
      cpf: "7456321558",
      carPlate: "PXG5050",
      password: "123456A@p",
      isPassenger: false,
      isDriver: true,
    };
    const httpResponse = await request(app).post("/signup").send(requestBody);
    expect(httpResponse.status).toEqual(422);
  });

  it("Should not be able to create an account with invalid email", async () => {
    const requestBody = {
      name: "John Doe",
      email: "johndoeexample.com",
      cpf: "97456321558",
      carPlate: "PXG5050",
      password: "123456A@p",
      isPassenger: false,
      isDriver: true,
    };
    const httpResponse = await request(app).post("/signup").send(requestBody);
    expect(httpResponse.status).toEqual(422);
  });

  it("Should not be able to create an account with duplicate email", async () => {
    const email = "johndoe@example.com";
    await databaseConnetion.query(
      "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [randomUUID(), "jany doe", email, "00000000000", "", true, true, "123456"]
    );
    const requestBody = {
      email,
      name: "John Doe",
      cpf: "97456321558",
      carPlate: "PXG5050",
      password: "123456A@p",
      isPassenger: false,
      isDriver: true,
    };
    const httpResponse = await request(app).post("/signup").send(requestBody);
    expect(httpResponse.status).toEqual(422);
  });
});
