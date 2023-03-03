import request from "supertest";
import { DataSource } from "typeorm";
import { app } from "../../../../app";
import { createConnection } from "../../../../database";
import { ICreateUserDTO } from "./ICreateUserDTO";

let connection: DataSource;

const user: ICreateUserDTO = {
  name: "John",
  password: "12345",
  email: "john@example.com",
};

describe("CreateUseController", () => {
  beforeAll(async () => {
    connection = await createConnection("localhost");

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.destroy();
  });

  it("should be able to create a user", async () => {
    const response = await request(app).post("/api/v1/users").send(user);

    expect(response.statusCode).toBe(201);
  });
});
