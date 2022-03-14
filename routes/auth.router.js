const { Router } = require("express");
const {check} = require("express-validator");

const {login, googleSignIn} = require("../controllers/auth.contoller");
const { validateFields } = require('../middlewares')


const router = Router();

router.post("/login",[
    check('email', 'El correo no es valido').isEmail(),
    check('password', 'El password no es valido').notEmpty(),
    validateFields
], login);

router.post("/google",[
    check('id_token', 'El id_token es necesario').notEmpty(),
    validateFields
], googleSignIn);



module.exports = router;
