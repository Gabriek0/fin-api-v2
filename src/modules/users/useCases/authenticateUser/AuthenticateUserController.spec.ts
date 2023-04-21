import request from "supertest";
import { app } from "../../../../app";

import { DataSource } from "typeorm";
import createConnection from "../../../../database";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";

let connection: DataSource;

const user: ICreateUserDTO = {
  name: "John",
  password: "12345",
  email: "james@example.com",
};

describe("AuthenticateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection("localhost");

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.destroy();
  });

  it("should be able authenticate a user", async () => {
    await request(app).post("/api/v1/users").send(user);

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
  });
});
