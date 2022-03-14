const {response} = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user");


const validateJWT = async (req, res = response, next) => {
    const token = req.header('x-token');

    if ( !token ){
        return res.status(401).json({
            msg: "No hay token en la petición"
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRET_PRIVATE_KEY);

        // Catch the user who is authenticated
        const userAuth = await User.findById(uid);

        if (!userAuth){
            return res.status(401).json({
                msg: "Token no válido - no user exists in database"
            })
        }

        // Check if the user has true status
        if (!userAuth.state){
            return res.status(401).json({
                msg: "Token no válido - user state: false"
            })
        }

        req.userAuth = userAuth;
        next();
    }catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token no válido"
        })
    }
}

module.exports = {
    validateJWT
}
