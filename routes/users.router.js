const { Router } = require("express");
const {check} = require("express-validator");

const { validateFields,
        validateJWT,
        isAdminRole,
        hasRole
        } = require('../middlewares')

const {isRoleValid, existEmail, existUserId} = require("../helpers/db-validators");

const {
    getUsers,
    postUser,
    putUser,
    patchUser,
    deleteUser,
} = require("../controllers/users.contoller");

const router = Router();

router.get("/", getUsers);

router.post("/", [
    check('name', 'El name es obligatorio').notEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({min: 6}),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom( existEmail ),
    check('role').custom( isRoleValid ),
  validateFields
], postUser);

router.put("/:id",[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existUserId ),
    check('role').custom( isRoleValid ),
    validateFields
], putUser);

router.patch("/", patchUser);

router.delete("/:id",[
    validateJWT,
    // isAdminRole,
        hasRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existUserId ),
    validateFields
], deleteUser);

module.exports = router;
