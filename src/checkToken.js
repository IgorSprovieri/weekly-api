const usersList = require("./lists/users");

function responseObject(access, status, message) {
  const object = new Object();
  object.access = access;
  object.status = Number(status);
  object.message = message;
  return object;
}

const response = async (userid, token) => {
  const userExists = await usersList.exists({ _id: userid });

  if (!userExists) {
    return responseObject(false, 404, "User not found");
  }

  const userFoundWithToken = await usersList.find({ token: token });

  if (!userFoundWithToken[0]) {
    return responseObject(false, 404, "Token not found");
  }

  if (userid != userFoundWithToken[0].id) {
    return responseObject(false, 403, "Token is invalid");
  }

  return responseObject(true, 200, "-");
};

module.exports = response;
