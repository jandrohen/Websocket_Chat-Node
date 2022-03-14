const { response, request } = require("express");
const bcryptjs = require('bcryptjs');

const User = require("../models/user");
const {generateJwt} = require("../helpers/generate-jwt");
const {googleVerify} = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {

    //Verify email exist
    const user = await  User.findOne({email});
    if ( !user ){
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - email'
      })
    }

    //State user active
    if ( !user.state ){
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - state'
      })
    }

    //Verify password valid
    const validPassword = bcryptjs.compareSync( password, user.password);
    if ( !validPassword ){
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password'
      })
    }

    //Generate JWT
    const token = await generateJwt(user.id);


    res.json({
      user,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "Hable con el administrador"
    });
  }
};


const googleSignIn = async (req, res = response) => {

  const { id_token } = req.body;

  try {

    const { email, name, img } = await googleVerify( id_token );

    let user = await User.findOne({ email });

    //Create user
    if ( !user ){
      const  data = {
        name,
        email,
        password: ':P',
        img,
        google: true
      };

      user = new User( data );
      await user.save();
    }

    // If the user was already in the DBO
    if ( !user.state ){
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado"
      })
    }

    //Generate JWT
    const token = await generateJwt(user.id);

    res.json({
      user,
      token
    })

  } catch (error) {
    res.status(400).json({
      msg: 'El token no se pudo verificar'
    })
  }

}

module.exports = {
  login,
  googleSignIn
};
