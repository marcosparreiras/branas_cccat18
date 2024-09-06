import pgPromise from "pg-promise";
import type pg from "pg-promise/typescript/pg-subset";

export interface DbConnection {
  run(sql: string, params?: any[]): Promise<any[]>;
  end(): Promise<void>;
}

export class PgConnection implements DbConnection {
  private connetion: pgPromise.IDatabase<{}, pg.IClient>;

  constructor(connectionURL: string) {
    this.connetion = pgPromise()(connectionURL);
  }

  async run(sql: string, params?: any[]): Promise<any[]> {
    const result = await this.connetion.query(sql, params);
    return result;
  }

  async end(): Promise<void> {
    await this.connetion.$pool.end();
  }
}
