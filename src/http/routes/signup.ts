import crypto from "crypto";
import pgp from "pg-promise";
import { type Request, type Response } from "express";
import { validateCpf } from "../../utils/validateCpf";

export async function signup(req: Request, res: Response) {
  const input = req.body;
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  try {
    const [acc] = await connection.query(
      "SELECT * FROM ccca.account WHERE email = $1",
      [input.email]
    );
    if (acc) {
      return res.status(422).json({ message: "account already exists" });
    }
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) {
      return res.status(422).json({ message: "Invalid name" });
    }
    if (!input.email.match(/^(.+)@(.+)$/)) {
      return res.status(422).json({ message: "Invalid email" });
    }
    if (!validateCpf(input.cpf)) {
      return res.status(422).json({ message: "Invalid cpf" });
    }
    const id = crypto.randomUUID();
    if (input.isDriver) {
      if (!input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
        return res.status(422).send({ message: "Invalid car plate" });
      }
      await connection.query(
        `INSERT INTO ccca.account(account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) 
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
    } else {
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
    }

    const result = {
      accountId: id,
    };
    if (typeof result === "number") {
      res.status(422).json({ message: result });
    } else {
      res.status(201).json(result);
    }
  } finally {
    await connection.$pool.end();
  }
}
