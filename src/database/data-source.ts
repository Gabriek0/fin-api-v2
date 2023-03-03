import { User } from "../modules/users/entities/User";
import { Statement } from "../modules/statements/entities/Statement";

import { DataSource } from "typeorm";

const dataSource = new DataSource({
  port: 5432,
  type: "postgres",
  host: "localhost",
  username: "postgres",
  password: "docker",
  database: "fin_api",
  logging: false,
  synchronize: false,
  subscribers: [],
  entities: [User, Statement],
  migrations: ["./src/database/migrations/*.ts"],
});

export { dataSource };
