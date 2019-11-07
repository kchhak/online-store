const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const keys = require("../../config/keys");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require ("../validation/login");

const register = async data => {
  try {
    const { message, isValid } = validateRegisterInput(data);

    if (!isValid) {
      throw new Error(message);
    }

    const {name, email, password} = data;

    const existingUser = await User.findOne({email});
    if (existingUser) {
      throw new Error("This user already exists");
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = new User(
      {
        name,
        email,
        password: hashedPass
      },
      err => { 
        if (err) throw err;
      }
    );

    user.save();

    const token = jwt.sign({id: user._id}, keys.secretOrKey);

    return {token, loggedIn: true, ...user._doc, password: null};

  } catch (err) {
    throw err;
  }
};

const logout = async data => {
  try {
    const {_id} = data;

    const user = await User.findById(_id);
    if (!user) throw new Error("User does not exist");

    const token = "";

    return {token, loggedIn: false, ...user._doc, password: null};
  } catch (err) {
    throw err;
  }
};

const login = async data => {
  try {
    const {message, isValid} = validateLoginInput(data);
    if (!isValid) {
      throw new Error(message);
    }

    const {email, password} = data;

    const user = await User.findOne({email});
    if (!user) throw new Error("Invalid login credentials");

    const isValidPassword = await bcrypt.compareSync(password, user.password);
    if (!isValidPassword) throw new Error("Invalid login credentials");

    const token = jwt.sign({_id: user.id}, keys.secretOrKey);

    return { token, loggedIn: true, ...user._doc, password: null};
  
  } catch(err){
    throw err;
  }
};

module.exports = {register, logout, login};