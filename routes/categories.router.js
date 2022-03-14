const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');
const { existCategoryId } = require("../helpers/db-validators");

const { createCategory,
        getCategories,
        getCategory,
        updateCategory,
        deleteCategory
        } = require("../controllers/categories.contoller");

const router = Router();

// Get all categories
router.get("/", getCategories);

// Get one category for id-public
router.get("/:id",[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existCategoryId ),
    validateFields,
], getCategory);

// Create category - private - any person with token validated
router.post("/", [
    validateJWT,
    check('name', 'El name es obligatorio').notEmpty(),
    validateFields
], createCategory);

// Update category - private - any person with token validated
router.put("/:id",[
    validateJWT,
    check('name', 'El name es obligatorio').notEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existCategoryId ),
    validateFields
],updateCategory);

// Delete one category - private - Admin user
router.delete("/:id", [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existCategoryId ),
    validateFields
], deleteCategory );



module.exports = router;
