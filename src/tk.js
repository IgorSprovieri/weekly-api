const usersList = require("../schemas/usersList");

async function checkToken(userid, token) {
  const userFound = await usersList.find({ token: token });

  if (!userFound[0]) {
    return false;
  }

  if (userid != userFound[0].id) {
    return false;
  }

  return true;
}

module.exports = checkToken;
