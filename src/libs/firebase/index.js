const admin = require("firebase-admin");

class FirebaseAuth {
  async createUser({ name, email, password }) {
    const userRecord = await admin.auth().createUser({
      displayName: name,
      email: email,
      password: password,
    });

    return {
      uid: userRecord.uid,
      name: userRecord.displayName,
      email: userRecord.email,
    };
  }

  async validateToken(token) {
    const { email } = await admin.auth().verifyIdToken(token);

    return { email };
  }

  async getUser(email) {
    const foundUser = await admin.auth().getUserByEmail(email);

    return {
      uid: foundUser.uid,
      name: foundUser.displayName,
      email: foundUser.email,
    };
  }

  async updateUser(uid, { name, email }) {
    const updatedUser = await admin
      .auth()
      .updateUser(uid, { displayName: name, email });

    return {
      uid: updatedUser.uid,
      name: updatedUser.displayName,
      email: updatedUser.email,
    };
  }

  async deleteUser(uid) {
    return await admin.auth().deleteUser(uid);
  }
}

module.exports = { firebaseAuth: new FirebaseAuth() };
