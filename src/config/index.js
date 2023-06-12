const config = {
  dev: {
    database: "mongodb://localhost:27017",
  },
  test: {
    database: process.env.TEST_DB,
  },
  prod: {
    database: process.env.PROD_DB,
  },
};

module.exports = config;
