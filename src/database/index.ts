import { DataSource } from "typeorm";

import { dataSource } from "./data-source";

function createConnection(host = "database"): Promise<DataSource> {
  return dataSource
    .setOptions({
      host,
    })
    .initialize();
}

export { createConnection };
