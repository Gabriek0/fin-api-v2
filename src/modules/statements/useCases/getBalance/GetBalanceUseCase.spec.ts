// Interfaces
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

// UseCases
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

// DTO
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { OperationType } from "../../entities/Statement";
import { GetBalanceError } from "./GetBalanceError";

let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;

const user: ICreateUserDTO = {
  name: "John",
  password: "12345",
  email: "john@example.com",
};

describe("GetBalanceUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able get user balance", async () => {
    const userCreated = await createUserUseCase.execute(user);

    const first_statement: ICreateStatementDTO = {
      amount: 100,
      user_id: userCreated.id,
      description: "My deposit",
      type: OperationType.DEPOSIT,
    };

    const second_statement: ICreateStatementDTO = {
      amount: 100,
      user_id: userCreated.id,
      description: "My deposit",
      type: OperationType.DEPOSIT,
    };

    await createStatementUseCase.execute(first_statement);
    await createStatementUseCase.execute(second_statement);

    const balance = await getBalanceUseCase.execute({
      user_id: userCreated.id,
    });

    expect(balance.balance).toEqual(200);
    expect(balance.statement).toHaveLength(2);
    expect(balance).toHaveProperty("balance");
  });

  it("should not be able to get the balance for a non-existent user", async () => {
    try {
      await getBalanceUseCase.execute({
        user_id: "XXX",
      });
    } catch (err) {
      console.log(err);

      if (err instanceof GetBalanceError) {
        expect(err.message).toBe("User not found");
      }

      expect(err).toBeInstanceOf(GetBalanceError);
    }
  });
});
