import { DataSource } from "typeorm";
import { createConnection } from "../../../../database";

import request from "supertest";
import { app } from "../../../../app";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType, Statement } from "../../entities/Statement";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";

let connection: DataSource;

interface IAuthenticationResponse {
  user: User;
  token: string;
}

interface IBalanceResponse {
  statement: Statement[];
  balance: number;
}

type User = {
  id: string;
  name: string;
  email: string;
};

const user: ICreateUserDTO = {
  name: "James",
  email: "james@example.com",
  password: "12345",
};

describe("GetBalanceController", () => {
  beforeAll(async () => {
    connection = await createConnection("localhost");

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.destroy();
  });

  it("should be able get balance", async () => {
    await request(app).post("/api/v1/users").send(user);

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    const { user: userRequested, token } =
      responseToken.body as IAuthenticationResponse;

    const deposit: ICreateStatementDTO = {
      amount: 200,
      description: "Deposit",
      type: OperationType.DEPOSIT,
      user_id: userRequested.id,
    };

    const withdraw: ICreateStatementDTO = {
      amount: 50,
      description: "Withdraw",
      type: OperationType.WITHDRAW,
      user_id: userRequested.id,
    };

    await request(app)
      .post("/api/v1/statements/deposit")
      .send(deposit)
      .set("Authorization", `Bearer ${token}`);

    await request(app)
      .post("/api/v1/statements/withdraw")
      .send(withdraw)
      .set("Authorization", `Bearer ${token}`);

    const balanceData = await request(app)
      .get("/api/v1/statements/balance")
      .set("Authorization", `Bearer ${token}`);

    const { statement, balance } = balanceData.body as IBalanceResponse;

    expect(balance).toBe(150);
    expect(statement).toHaveLength(2);
    expect(statement[0]).toHaveProperty("id");
    expect(statement[1]).toHaveProperty("id");
    expect(statement[0].type).toBe(OperationType.DEPOSIT);
    expect(statement[1].type).toBe(OperationType.WITHDRAW);
  });
});
