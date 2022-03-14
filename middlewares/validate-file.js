const { response } = require("express");

const validateUploadFile = (req, res = response, next) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res
      .status(400)
      .send({ msg: "No hay archivos en la petición - validateUploadFile" });
  }

  next();
};

module.exports = {
  validateUploadFile,
};
