import request from "supertest";
import { app } from "../../../../app";

import { DataSource } from "typeorm";
import { createConnection } from "../../../../database";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";

let connection: DataSource;

const user: ICreateUserDTO = {
  name: "John",
  password: "12345",
  email: "james@example.com",
};

describe("CreateStatementController", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.destroy();
  });

  it("should be able create a deposit", async () => {
    await request(app).post("/api/v1/users").send(user);

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    const token = responseToken.body.token;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "It is a deposit!",
      })
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    expect(response.statusCode).toBe(201);
    // expect(response.body).toHaveProperty("id");
  });

  it("should be able create a withdraw", async () => {
    await request(app).post("/api/v1/users").send(user);

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    const token = responseToken.body.token;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 20,
        description: "It is a deposit!",
      })
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    expect(response.statusCode).toBe(201);
    // expect(response.body).toHaveProperty("id");
  });
});
