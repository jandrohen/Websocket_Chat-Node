const { Router } = require("express");
const {check} = require("express-validator");

const { validateFields, validateUploadFile} = require('../middlewares')
const { uploadFile, updateImage, viewImage, updateImageCloudinary} = require("../controllers/uploads.contoller");
const {permittedCollection} = require("../helpers");


const router = Router();

router.post('/', validateUploadFile, uploadFile);

router.put('/:collection/:id',[
    validateUploadFile,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom(c => permittedCollection(c ,['users', 'products'])),
    validateFields
], updateImageCloudinary);
// ], updateImage);

router.get('/:collection/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('collection').custom(c => permittedCollection(c ,['users', 'products'])),
], viewImage)

module.exports = router;
