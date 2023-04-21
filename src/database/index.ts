import { DataSource } from "typeorm";

import dataSource from "./data-source";

function createConnection(host = "database"): Promise<DataSource> {
  return dataSource
    .setOptions({
      host: process.env.NODE_ENV === "test" ? "localhost" : host,
      database:
        process.env.NODE_ENV === "test"
          ? "fin_api_test"
          : (dataSource.options.database as string),
    })
    .initialize();
}

export default createConnection;
