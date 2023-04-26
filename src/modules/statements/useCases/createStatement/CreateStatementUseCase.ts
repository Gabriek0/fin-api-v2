import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    user_id, // USER LOGGED
    type,
    sender_id: recipient_id, // RECIPIENT ID OF USER
    amount,
    description,
  }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);
    const recipient = await this.usersRepository.findById(recipient_id);

    // user_id => sender_id
    // SENDER_ID => user_id;

    if (!user || !recipient) {
      throw new CreateStatementError.UserNotFound();
    }

    if (user.id === recipient.id && type === "transfer") {
      throw new CreateStatementError.ItsYou();
    }

    if (type === "withdraw" || type === "transfer") {
      const { balance } = await this.statementsRepository.getUserBalance({
        user_id,
      });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds();
      }
    }

    if (type !== "transfer") {
      recipient_id = "null";
    }

    if (type === "transfer") {
      await this.statementsRepository.create({
        user_id: recipient_id,
        sender_id: user_id,
        amount,
        description,
        type,
      });
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      sender_id: "null",
      type,
      amount,
      description,
    });

    return statementOperation;
  }
}
