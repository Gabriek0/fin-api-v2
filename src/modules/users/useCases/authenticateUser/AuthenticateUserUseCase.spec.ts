import "reflect-metadata";

import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

const user: ICreateUserDTO = {
  name: "John",
  email: "john@example.com",
  password: "12345",
};

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("AuthenticateUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able authenticate user", async () => {
    await createUserUseCase.execute(user);

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(userAuthenticated).toHaveProperty("token");
  });

  it("should not be able authenticate user if email is incorrect", async () => {
    expect(async () => {
      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "james@example.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able authenticate incorrect password", async () => {
    expect(async () => {
      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "123",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
