// UseCases
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

// Interfaces
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { OperationType } from "../../entities/Statement";

import { GetStatementOperationError } from "../getStatementOperation/GetStatementOperationError";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;

const user: ICreateUserDTO = {
  name: "John",
  email: "john@example.com",
  password: "12345",
};

describe("GetStatementOperationUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able get a statement operation", async () => {
    const userCreated = await createUserUseCase.execute(user);

    const statement_deposit: ICreateStatementDTO = {
      user_id: userCreated.id,
      amount: 150,
      description: "Statement deposit test",
      type: OperationType.DEPOSIT,
    };

    const statement_withdraw: ICreateStatementDTO = {
      user_id: userCreated.id,
      amount: 50,
      description: "Statement withdraw test",
      type: OperationType.WITHDRAW,
    };

    const statement_deposit_created = await createStatementUseCase.execute(
      statement_deposit
    );

    await createStatementUseCase.execute(statement_withdraw);

    if (!statement_deposit_created.id) return;

    const getStatement = await getStatementOperationUseCase.execute({
      user_id: userCreated.id,
      statement_id: statement_deposit_created.id,
    });

    expect(getStatement).toHaveProperty("id");
    expect(getStatement.type).toEqual(OperationType.DEPOSIT);
  });

  it("should not be able get a statement operation with non-existent user", async () => {
    const userCreated = await createUserUseCase.execute(user);

    const statement: ICreateStatementDTO = {
      user_id: userCreated.id,
      amount: 150,
      description: "Statement deposit test",
      type: OperationType.DEPOSIT,
    };

    const statementCreated = await createStatementUseCase.execute(statement);

    const getStatement = async () => {
      if (!statementCreated.id) return;

      await getStatementOperationUseCase.execute({
        user_id: "12345",
        statement_id: statementCreated.id,
      });
    };

    await expect(getStatement).rejects.toBeInstanceOf(
      GetStatementOperationError.UserNotFound
    );
  });

  it("should not be able get a statement operation with non-existent statement", async () => {
    const userCreated = await createUserUseCase.execute(user);

    const statement: ICreateStatementDTO = {
      user_id: userCreated.id,
      amount: 150,
      description: "Statement deposit test",
      type: OperationType.DEPOSIT,
    };

    const statementCreated = await createStatementUseCase.execute(statement);

    const getStatement = async () => {
      if (!statementCreated.id) return;

      await getStatementOperationUseCase.execute({
        user_id: userCreated.id,
        statement_id: "123",
      });
    };

    await expect(getStatement).rejects.toBeInstanceOf(
      GetStatementOperationError.StatementNotFound
    );
  });
});
