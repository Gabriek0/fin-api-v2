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

describe("ShowUserProfileController", () => {
  beforeAll(async () => {
    connection = await createConnection("localhost");

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.destroy();
  });

  it("should be able show user profile", async () => {
    await request(app).post("/api/v1/users").send(user);

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    const token = responseToken.body.token;

    const response = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.body).toHaveProperty("id");
  });
});
