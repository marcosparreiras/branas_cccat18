import type { Account } from "../src/domain/entities/account";
import type { AccountRepository } from "../src/domain/repositories/account-repository";

export class InMemoryAccountRepository implements AccountRepository {
  public items: Account[] = [];

  async existsWithEmail(email: string): Promise<boolean> {
    const account = this.items.find((item) => item.getEmail() === email);
    return !!account;
  }

  async create(account: Account): Promise<void> {
    this.items.push(account);
  }
}
