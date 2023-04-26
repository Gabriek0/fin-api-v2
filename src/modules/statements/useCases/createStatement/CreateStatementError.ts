import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateStatementError {
  export class UserNotFound extends AppError {
    constructor() {
      super("User not found", 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super("Insufficient funds", 400);
    }
  }

  export class ItsYou extends AppError {
    constructor() {
      super("It's not possible send transfer to you", 400);
    }
  }
}
