const Validator = require("validator");
const validText = require("./valid-text");

module.exports = function validateLoginInput(data) {
  data.name = validText(data.name) ? data.name : "";
  data.email = validText(data.email) ? data.email : "";
  data.password = validText(data.password) ? data.password : "";

  if (Validator.isEmpty(data.name)) {
    return { message: "Name is required", isValid: false };
  }

  if (!Validator.isEmail(data.email)) {
    return { message: "Invalid email", isValid: false };
  }

  if (Validator.isEmpty(data.email)) {
    return { message: "Email is required", isValid: false };
  }

  if (Validator.isEmpty(data.password)) {
    return { message: "Password is required", isValid: false };
  }

  if (!Validator.isLength(data.password, {min: 8, max: 32})) {
    return { message: "Password must be between 8 and 32 characters", isValid: false };
  }

  return {
    message: "",
    isValid: true
  };
};
