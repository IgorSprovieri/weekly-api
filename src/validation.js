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
    const regex = /^\d{4}-[0-1][0-2]-[0-3]\d\s([0-1][0-9]|2[0-3]):[0-5]\d$/;
    return regex.test(date);
  },

  validateBool: (boolString) => {
    const regex = /^(?i:true|false)$/;
    return regex.test(boolString);
  },

  validateHexColor: (hexColor) => {
    const regex = /^#[0-9A-F]{6}$/i;
    return regex.test(hexColor);
  },
};

module.exports = validations;
