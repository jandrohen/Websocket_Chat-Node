const jwt = require("jsonwebtoken");
const { User } = require("../models");

const generateJwt = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRET_PRIVATE_KEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const checkJWT = async (token = "") => {
  try {
    if (token.length < 10) {
      return null;
    }
    const { uid } = jwt.verify(token, process.env.SECRET_PRIVATE_KEY);
    const userAuth = await User.findById(uid);
    if (userAuth && userAuth.state) {
        return userAuth;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

module.exports = {
  generateJwt,
    checkJWT
};
