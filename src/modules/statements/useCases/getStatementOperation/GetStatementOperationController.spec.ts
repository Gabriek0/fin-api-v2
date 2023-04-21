import { DataSource } from "typeorm";
import createConnection from "../../../../database";

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

describe("GetStatementOperation", () => {
  beforeAll(async () => {
    connection = await createConnection("localhost");

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.destroy();
  });

  it("should be able get statement operation", async () => {
    await request(app).post("/api/v1/users").send(user);

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    const { user: userRequested, token } =
      responseToken.body as IAuthenticationResponse;

    const deposit: ICreateStatementDTO = {
      amount: 300,
      description: "Deposit",
      type: OperationType.DEPOSIT,
      user_id: userRequested.id,
    };

    const depositResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .send(deposit)
      .set("Authorization", `Bearer ${token}`);

    const { id: depositOperationId } = depositResponse.body as Statement;

    const statementRequested = await request(app)
      .get(`/api/v1/statements/${depositOperationId}`)
      .set("Authorization", `Bearer ${token}`);

    const statementOperation = statementRequested.body as Statement;

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.amount).toBe("300.00");
    expect(statementOperation.type).toBe(OperationType.DEPOSIT);
  });
});
