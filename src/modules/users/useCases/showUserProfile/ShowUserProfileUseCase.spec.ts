import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

import { User } from "../../entities/User";
import { ShowUserProfileError } from "./ShowUserProfileError";

let inMemoryUsersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

const user: ICreateUserDTO = {
  name: "John",
  email: "john@example.com",
  password: "12345",
};

describe("ShowUserProfileUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able show user profile", async () => {
    const userCreated = await createUserUseCase.execute(user);
    const userProfile = await showUserProfileUseCase.execute(userCreated.id);

    expect(userProfile).toBeDefined();
    expect(userProfile).toBeInstanceOf(User);
    expect(userProfile).toHaveProperty("id");
  });

  it("should not be able show user profile with id inexistent", async () => {
    await createUserUseCase.execute(user);

    await expect(
      async () => await showUserProfileUseCase.execute("XXX")
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
