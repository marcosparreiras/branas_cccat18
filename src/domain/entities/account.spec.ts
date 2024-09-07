import { InvalidCarPlateException } from "../exceptions/invalid-car-plate-exception";
import { InvalidCpfException } from "../exceptions/invalid-cpf-exception";
import { InvalidEmailException } from "../exceptions/invalid-email-exception";
import { InvalidNameException } from "../exceptions/invalid-name-exception";
import { Account } from "./account";

describe("Account", () => {
  it("Should be able to create an passenger", () => {
    const input = {
      name: "John Doe",
      email: "johndoe@example.com",
      cpf: "97456321558",
      password: "12345$Pa",
      isPassenger: true,
    };
    const account = Account.create(input);
    expect(account.getId()).toEqual(expect.any(String));
    expect(account.getName()).toEqual(input.name);
    expect(account.getEmail()).toEqual(input.email);
    expect(account.getCpf()).toEqual(input.cpf);
    expect(account.isPassenger()).toEqual(true);
    expect(account.isDriver()).toEqual(false);
    expect(account.getCarPlate()).toEqual(null);
  });

  it("Should be able to create a driver", () => {
    const input = {
      name: "John Doe",
      email: "johndoe@example.com",
      cpf: "97456321558",
      password: "12345$Pa",
      carPlate: "DFO4689",
      isDriver: true,
    };
    const account = Account.create(input);
    expect(account.getId()).toEqual(expect.any(String));
    expect(account.getName()).toEqual(input.name);
    expect(account.getEmail()).toEqual(input.email);
    expect(account.getCpf()).toEqual(input.cpf);
    expect(account.isPassenger()).toEqual(false);
    expect(account.isDriver()).toEqual(true);
    expect(account.getCarPlate()).toEqual(input.carPlate);
  });

  it("Should not be able to create a driver with an invalid car plate", () => {
    const input = {
      name: "John Doe",
      email: "johndoe@example.com",
      cpf: "97456321558",
      password: "12345$Pa",
      carPlate: "DFO468",
      isDriver: true,
    };
    expect(() => Account.create(input)).toThrowError(InvalidCarPlateException);
  });

  it("Should not be able to create an account with an invalid cpf", () => {
    const input = {
      name: "John Doe",
      email: "johndoe@example.com",
      cpf: "9745632155",
      password: "12345$Pa",
      isPassenger: true,
    };
    expect(() => Account.create(input)).toThrowError(InvalidCpfException);
  });

  it("Should not be able to create an account with invalid email", () => {
    const input = {
      name: "John Doe",
      email: "johndoeexample.com",
      cpf: "97456321558",
      password: "12345$Pa",
      isPassenger: true,
    };
    expect(() => Account.create(input)).toThrowError(InvalidEmailException);
  });

  it("Should not be able to create an account a single word name", () => {
    const input = {
      name: "John",
      email: "johndoe@example.com",
      cpf: "97456321558",
      password: "12345$Pa",
      isPassenger: true,
    };
    expect(() => Account.create(input)).toThrowError(InvalidNameException);
  });
});
