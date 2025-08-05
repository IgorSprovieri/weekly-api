import { enviroment } from "./enviroment";

export const config = {
  dev: {
    database: "mongodb://localhost:27017",
  },
  test: {
    database: enviroment.TEST_DB,
  },
  prod: {
    database: enviroment.PROD_DB,
  },
};
