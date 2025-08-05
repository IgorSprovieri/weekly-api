export const validations = {
  validateIdObject: (IdObject: unknown) => {
    if (typeof IdObject !== "string") {
      return false;
    }

    const regex = /^[0-9a-fA-F]{24}$/;
    return regex.test(IdObject);
  },

  validateEmail: (email: unknown) => {
    if (typeof email !== "string") {
      return false;
    }

    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  },

  validatePassword: (password: unknown) => {
    if (typeof password !== "string") {
      return false;
    }

    const regex = /^\d{6}$/;
    return regex.test(password);
  },

  validateDate: (date: unknown) => {
    if (typeof date !== "string") {
      return false;
    }

    const regex = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d).(\d{3})Z$/;
    return regex.test(date);
  },

  validateBool: (value: unknown) => {
    return typeof value === "boolean";
  },

  validateHexColor: (hexColor: unknown) => {
    if (typeof hexColor !== "string") {
      return false;
    }

    const regex = /^#[0-9A-F]{6}$/i;
    return regex.test(hexColor);
  },
};
