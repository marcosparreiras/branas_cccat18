import type { Account } from "../entities/account";

export interface AccountRepository {
  existsWithEmail(email: string): Promise<boolean>;
  create(account: Account): Promise<void>;
}
