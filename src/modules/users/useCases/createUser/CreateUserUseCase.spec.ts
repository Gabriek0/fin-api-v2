import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";
import { CreateUserError } from "./CreateUserError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: IUsersRepository;

const first_user: ICreateUserDTO = {
  name: "James",
  email: "james@example.com",
  password: "12345",
};

const second_user: ICreateUserDTO = {
  name: "John",
  email: "james@example.com",
  password: "12345",
};

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    // create instances
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able create a new user", async () => {
    const user = await createUserUseCase.execute(first_user);

    expect(user.name).toBe("James");
    expect(user).toHaveProperty("id");
  });

  it("should be not able create a user that already exists", async () => {
    await expect(async () => {
      await createUserUseCase.execute(first_user);
      await createUserUseCase.execute(second_user);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
