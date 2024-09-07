import { ValidateService } from "./validate-service";

describe("ValidateService | validaName", () => {
  it("Should validate a name with 2 words", () => {
    const name = "John Doe";
    const isValid = ValidateService.validateName(name);
    expect(isValid).toBe(true);
  });

  it("Should not validate a name with 1 word", () => {
    const name = "John";
    const isValid = ValidateService.validateName(name);
    expect(isValid).toBe(false);
  });
});

describe("ValidateService | validateEmail", () => {
  it("Should validate a email with a valid format", () => {
    const email = "johndoe@example.com";
    const isValid = ValidateService.validateEmail(email);
    expect(isValid).toBe(true);
  });

  it("Should not validate a email with an invalid format", () => {
    const email = "johndoeexample.com";
    const isValid = ValidateService.validateEmail(email);
    expect(isValid).toBe(false);
  });
});

describe("ValidateService | carPlate", () => {
  it("Should valdiate a car plate with a valid format (3 letters and 4 numbers)", () => {
    const carPlate = "GKS5623";
    const isValid = ValidateService.validateCarPlate(carPlate);
    expect(isValid).toBe(true);
  });

  it("Should not valdiate a car plate with an invalid format", () => {
    const carPlate = "GKS562F3";
    const isValid = ValidateService.validateCarPlate(carPlate);
    expect(isValid).toBe(false);
  });
});

describe("ValidateService | validateCpf", () => {
  test("Deve validar um cpf com o digito diferente de zero", function () {
    const cpf = "97456321558";
    const isValid = ValidateService.validateCpf(cpf);
    expect(isValid).toBe(true);
  });

  test("Deve validar um cpf com o segundo digito zero", function () {
    const cpf = "71428793860";
    const isValid = ValidateService.validateCpf(cpf);
    expect(isValid).toBe(true);
  });

  test("Deve validar um cpf com o primeiro digito zero", function () {
    const cpf = "87748248800";
    const isValid = ValidateService.validateCpf(cpf);
    expect(isValid).toBe(true);
  });

  test("Não deve validar um cpf com menos de 11 caracteres", function () {
    const cpf = "9745632155";
    const isValid = ValidateService.validateCpf(cpf);
    expect(isValid).toBe(false);
  });

  test("Não deve validar um cpf com todos os caracteres iguais", function () {
    const cpf = "11111111111";
    const isValid = ValidateService.validateCpf(cpf);
    expect(isValid).toBe(false);
  });

  test("Não deve validar um cpf com letras", function () {
    const cpf = "97a56321558";
    const isValid = ValidateService.validateCpf(cpf);
    expect(isValid).toBe(false);
  });
});
