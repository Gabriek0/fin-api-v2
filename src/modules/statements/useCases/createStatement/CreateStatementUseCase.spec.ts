import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementRepository: IStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

const user: ICreateUserDTO = {
  name: "John",
  email: "john@example.com",
  password: "12345",
};

describe("CreateStatementUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementRepository
    );
  });

  it("should be able create a statement to user", async () => {
    const userCreated = await createUserUseCase.execute(user);

    const statement: ICreateStatementDTO = {
      user_id: userCreated.id,
      amount: 100,
      description: "Deposit test",
      type: OperationType.DEPOSIT,
    };

    const statementCreated = await createStatementUseCase.execute(statement);

    expect(statementCreated).toHaveProperty("id");
    expect(statementCreated.amount).toEqual(statement.amount);
  });

  it("should not be able create a statement to non-existent user", async () => {
    expect(async () => {
      await createUserUseCase.execute(user);

      const statement: ICreateStatementDTO = {
        user_id: "1",
        amount: 100,
        description: "Deposit test",
        type: OperationType.DEPOSIT,
      };

      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a statement for a withdraw that is larger than the balance", async () => {
    expect(async () => {
      await createUserUseCase.execute(user);

      const first_statement: ICreateStatementDTO = {
        user_id: "1",
        amount: 100,
        description: "Deposit test",
        type: OperationType.DEPOSIT,
      };

      await createStatementUseCase.execute(first_statement);

      const second_statement: ICreateStatementDTO = {
        user_id: "1",
        amount: 1000,
        description: "Deposit test",
        type: OperationType.WITHDRAW,
      };

      await createStatementUseCase.execute(second_statement);
    }).rejects.toBeInstanceOf(AppError);
  });
});
