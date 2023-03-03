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

    console.log(statementCreated);

    expect(statementCreated).toHaveProperty("id");
    expect(statementCreated.amount).toEqual(statement.amount);
  });
});
