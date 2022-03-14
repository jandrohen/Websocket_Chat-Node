const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');
const { existProductId, existCategoryId } = require("../helpers/db-validators");

const { getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct
        } = require("../controllers/products.contoller");

const router = Router();

// Get all products
router.get("/", getProducts);

// Get one product for id-public
router.get("/:id",[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existProductId ),
    validateFields,
], getProduct);

// Create product - private - any person with token validated
router.post("/", [
    validateJWT,
    check('name', 'El name es obligatorio').notEmpty(),
    check('category', 'No es ID valido').isMongoId(),
    check('category').custom( existCategoryId ),
    validateFields
], createProduct);

// Update product - private - any person with token validated
router.put("/:id",[
    validateJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existProductId ),
    validateFields
], updateProduct);

// Delete one product - private - Admin user
router.delete("/:id", [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existProductId ),
    validateFields
], deleteProduct);



module.exports = router;
