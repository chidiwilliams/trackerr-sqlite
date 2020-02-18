import sqlite3 from 'sqlite3';
import {
  ExceptionInfo,
  ExceptionStore,
} from 'trackerr-abstract-exception-store';

export default class SQLiteStore implements ExceptionStore {
  private db: sqlite3.Database;
  private tableName = 'exceptions';
  private tableCreated = false;

  constructor(filename: string) {
    this.db = new sqlite3.Database(filename, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  private createTableIfNotExists(): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `CREATE TABLE IF NOT EXISTS ${this.tableName}(
        stack text,
        timestamp text
        )`;
      this.db.run(sql, (err: Error) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  async store(exceptionInfo: ExceptionInfo): Promise<void> {
    if (!this.tableCreated) {
      await this.createTableIfNotExists();
      this.tableCreated = true;
    }

    const sql = `INSERT INTO ${this.tableName} VALUES(?, ?)`;
    return new Promise((resolve, reject) => {
      this.db.run(
        sql,
        [exceptionInfo.stack, exceptionInfo.timestamp.toISOString()],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        },
      );
    });
  }

  async get(): Promise<ExceptionInfo[]> {
    if (!this.tableCreated) {
      await this.createTableIfNotExists();
      this.tableCreated = true;
    }

    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${this.tableName}`;
      this.db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const exceptions = rows.map((row) => ({
          stack: row.stack,
          timestamp: new Date(row.timestamp),
        }));
        resolve(exceptions);
      });
    });
  }
}
