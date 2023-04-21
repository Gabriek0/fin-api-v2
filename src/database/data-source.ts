import { User } from "../modules/users/entities/User";
import { Statement } from "../modules/statements/entities/Statement";

import { DataSource } from "typeorm";

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "docker",
  database: process.env.NODE_ENV === "test" ? "fin_api_test" : "fin_api",
  logging: false,
  synchronize: false,
  entities: [User, Statement],
  migrations: ["./src/database/migrations/*.ts"],
  subscribers: [],
});

export default dataSource;
