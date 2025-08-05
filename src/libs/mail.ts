import NodeMailJet from "node-mailjet";
import { enviroment } from "../config/enviroment";

type SendForgotPasswordEmailDto = {
  name: string;
  email: string;
  token: string;
};

class Mail {
  private mailjet;

  constructor() {
    if (!enviroment.MJ_API_KEY || !enviroment.MJ_SECRET_KEY) {
      console.warn("Missing keys to connect to mailjet");
      return;
    }

    this.mailjet = NodeMailJet.apiConnect(
      enviroment.MJ_API_KEY,
      enviroment.MJ_SECRET_KEY
    );
  }

  async sendForgotPasswordEmail({
    name,
    email,
    token,
  }: SendForgotPasswordEmailDto) {
    try {
      if (!this.mailjet) {
        throw new Error("Can not connect to mailjet");
      }

      const result = await this.mailjet
        .post("send", { version: "v3.1" })
        .request({
          Messages: [
            {
              From: {
                Email: enviroment.MY_EMAIL,
                Name: enviroment.MY_EMAIL_NAME,
              },
              To: [
                {
                  Email: email,
                  Name: name,
                },
              ],
              Subject: "Redefinir sua senha",
              TextPart: "Greetings from Mailjet!",
              HTMLPart:
                "<h3>Olá " +
                name +
                "!</h3><br />Esse é o token para redefinição da sua senha:<br /><br />" +
                token +
                "<br /><br /> Equipe Weekly",
            },
          ],
        });
      return result;
    } catch (error) {
      return { error };
    }
  }
}

export const mail = new Mail();
