const usersList = require("./schemas/usersList");

const response = async (userid, token) => {
  const userFound = await usersList.findById(userid);

  if (!userFound[0]) {
    return false;
  }

  const userFoundWithToken = await usersList.find({ token: token });

  if (!userFoundWithToken[0]) {
    return false;
  }

  if (userFound[0].id != userFoundWithToken[0].id) {
    return false;
  }

  return true;
};

module.exports = response;
