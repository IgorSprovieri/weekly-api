class Enviroment {
  [key: string]: string | number | undefined;

  public ENVIROMENT: "prod" | "test" | "dev" = "test";
  public PORT = 3333;
  public CORS_URL = "*";

  public PROD_DB = "";
  public TEST_DB = "";

  public JWT_HASH = "my-super-secret";

  public MJ_API_KEY = "";
  public MJ_SECRET_KEY = "";
  public MY_EMAIL = "";
  public MY_EMAIL_NAME = "";

  constructor() {
    const env = process.env;

    Object.entries(this).forEach(([key, value]) => {
      if (!env[key]) return;

      if (typeof value === "number") {
        this[key] = Number(env[key]);
        return;
      }

      if (key === "ENVIROMENT") {
        // Só aceita os valores que definimos
        const envValue = env[key];
        if (envValue === "prod" || envValue === "test" || envValue === "dev") {
          this[key] = envValue;
        }
        return;
      }

      this[key] = env[key];
    });
  }
}

export const enviroment = new Enviroment();
