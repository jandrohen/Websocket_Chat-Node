const path = require('path');
const fs = require("fs");

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response, request } = require("express");
const { uploadFiles } = require("../helpers");

const { User, Product} = require("../models");

const uploadFile = async (req = request, res = response) => {

  try {
    // EXAMPLE (txt,md)
    // const name = await  uploadFiles(req.files, ['txt','md'], 'text');

    // Images
    const name = await uploadFiles(req.files, undefined, "img");
    res.json({ name });
  } catch (msg) {
    res.status(400).send({ msg });
  }
};

const updateImage = async (req = request, res = response) => {

  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }

      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "No he validado esto" });
  }

  // Clean preview images
  if ( model.img ){
    // Delete server image
    const pathImage = path.join( __dirname, '../uploads', collection, model.img );
    if ( fs.existsSync(pathImage) ){
      fs.unlinkSync(pathImage);
    }
  }

  const name = await uploadFiles( req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json(model);
};

const viewImage = async (req = request, res = response) => {

  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }

      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "No he validado esto" });
  }

  // Send the image of the user or product if you have it.
  if ( model.img ){
    const pathImage = path.join( __dirname, '../uploads', collection, model.img );
    if ( fs.existsSync(pathImage) ){
      return res.sendFile(pathImage)
    }
  }

  // Send a template image if you do not have
  const pathImage = path.join( __dirname,'../assets/no-image.jpg');
  res.sendFile( pathImage )
}

const updateImageCloudinary = async (req = request, res = response) => {

  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }

      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }

      break;

    default:
      return res.status(500).json({ msg: "No he validado esto" });
  }

  // Clean preview images
  if ( model.img ){
    const nameArr = model.img.split("/");
    const name = nameArr[nameArr.length - 1];
    const [ public_id ] = name.split('.');
    await cloudinary.uploader.destroy( public_id );
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  model.img = secure_url;

  await model.save();

  res.json(model);
};

module.exports = {
  uploadFile,
  updateImage,
  viewImage,
  updateImageCloudinary
};
