const validations = {
  validateIdObject: (IdObject) => {
    const regex = /^[0-9a-fA-F]{24}$/;
    return regex.test(IdObject);
  },

  validateEmail: (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  },

  validatePassword: (password) => {
    //const regex = /^\d+$/;
    const regex = /^\d{4}$/;
    return regex.test(password);
  },

  validateDate: (date) => {
    const regex = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d).(\d{3})Z$/;
    return regex.test(date);
  },

  validateBool: (boolString) => {
    const regex = /true|false/;
    return regex.test(boolString);
  },

  validateHexColor: (hexColor) => {
    const regex = /^#[0-9A-F]{6}$/i;
    return regex.test(hexColor);
  },
};

module.exports = validations;
