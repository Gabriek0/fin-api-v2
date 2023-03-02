import { User } from "../modules/users/entities/User";
import { Statement } from "../modules/statements/entities/Statement";

import { DataSource } from "typeorm";

const dataSource = new DataSource({
  port: 5432,
  type: "postgres",
  host: "database",
  username: "postgres",
  password: "docker",
  database: "fin_api",
  logging: false,
  synchronize: false,
  entities: [User, Statement],
  migrations: ["../database/migrations/*.ts"],
  subscribers: [],
});

export { dataSource };
