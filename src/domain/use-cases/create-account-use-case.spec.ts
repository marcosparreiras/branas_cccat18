import { InMemoryAccountRepository } from "../../../test-utils/in-memory-account-repository";
import { AccountAlreadyExistsException } from "../exceptions/account-already-exists-exception";
import { Account } from "../entities/account";
import { CreateAccountUseCase } from "./create-account-use-case";

describe("CreateAccountUseCase", () => {
  let inMemoryAccountRepository: InMemoryAccountRepository;
  let sut: CreateAccountUseCase;

  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository();
    sut = new CreateAccountUseCase(inMemoryAccountRepository);
  });

  it("Should be able to create an driver account", async () => {
    const input = {
      name: "John Doe",
      email: "johndoe@example.com",
      cpf: "97456321558",
      carPlate: "PXG5050",
      password: "123456A@p",
      isDriver: true,
    };
    const output = await sut.execute(input);
    expect(output.accountId).toEqual(expect.any(String));
    const accountOnRepository = inMemoryAccountRepository.items.find(
      (item) => item.getId() === output.accountId
    );
    expect(accountOnRepository?.getName()).toEqual(input.name);
    expect(accountOnRepository?.getEmail()).toEqual(input.email);
    expect(accountOnRepository?.getCpf()).toEqual(input.cpf);
    expect(accountOnRepository?.getCarPlate()).toEqual(input.carPlate);
    expect(accountOnRepository?.isDriver()).toEqual(true);
    expect(accountOnRepository?.isPassenger()).toEqual(false);
  });

  it("Should be able to create a passenger account", async () => {
    const input = {
      name: "John Doe",
      email: "johndoe@example.com",
      cpf: "97456321558",
      password: "123456A@p",
      isPassenger: true,
    };
    const output = await sut.execute(input);
    expect(output.accountId).toEqual(expect.any(String));
    const accountOnRepository = inMemoryAccountRepository.items.find(
      (item) => item.getId() === output.accountId
    );
    expect(accountOnRepository?.getName()).toEqual(input.name);
    expect(accountOnRepository?.getEmail()).toEqual(input.email);
    expect(accountOnRepository?.getCpf()).toEqual(input.cpf);
    expect(accountOnRepository?.isDriver()).toEqual(false);
    expect(accountOnRepository?.isPassenger()).toEqual(true);
  });

  it("Should not be able to create an account with an already registered email", async () => {
    const email = "johndoe@example.com";
    const account = Account.create({
      email,
      name: "Jany Brow",
      cpf: "97456321558",
      password: "654321$pA",
      carPlate: "HJS4612",
      isDriver: true,
    });
    inMemoryAccountRepository.items.push(account);
    const input = {
      email,
      name: "John Doe",
      cpf: "97456321558",
      password: "123456A@p",
      isPassenger: true,
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      AccountAlreadyExistsException
    );
  });
});
