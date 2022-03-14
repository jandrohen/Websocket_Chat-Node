const dbValidators = require('./db-validators');
const generateJwt = require('./generate-jwt');
const googleVerify = require('./google-verify');
const uploadFile = require('./upload-files');

module.exports ={
    ...dbValidators,
    ...generateJwt,
    ...googleVerify,
    ...uploadFile
}
