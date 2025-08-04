const NodeMailJet = require("node-mailjet");

const mailjet = NodeMailJet.apiConnect(
  process.env.MJ_API_KEY,
  process.env.MJ_SECRET_KEY
);

class Mail {
  async sendForgotPasswordEmail(email, name, token) {
    try {
      const result = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: process.env.MY_EMAIL,
              Name: process.env.MY_EMAIL_NAME,
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

module.exports = new Mail();
