const config = {
  dev: {
    database: "mongodb://localhost:27017",
    port: 3333,
  },
  test: {
    database: process.env.TEST_DB,
    port: Number(process.env.TEST_PORT),
  },
  prod: {
    database: process.env.PROD_DB,
    port: Number(process.env.PROD_PORT),
  },
};

module.exports = config;
