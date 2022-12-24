const usersList = require("./schemas/usersList");

const response = async (userid, token) => {
  const userFoundWithToken = await usersList.find({ token: token });

  if (!userFoundWithToken[0]) {
    return false;
  }

  if (userid != userFoundWithToken[0].id) {
    return false;
  }

  return true;
};

module.exports = response;
