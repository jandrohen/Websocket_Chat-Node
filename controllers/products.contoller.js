const { response, request} = require("express");
const { Product } = require("../models");

const getProducts = async (req = request, res = response) => {

  const { limit = 5, start = 0 } = req.query;
  const state =  { state : true };

  const [totalProducts, products ] = await Promise.all([
    Product.countDocuments(state),
    Product.find(state)
        .populate('user', 'name')
        .populate('category', 'name')
        .skip(Number(start))
        .limit(Number(limit))
  ])

  res.json({
    totalProducts,
    products
  });
};

const getProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const product =  await Product.findById(id)
                          .populate('user', 'name')
                          .populate('category', 'name')

  res.json(product);
};

const createProduct = async (req = request, res = response) => {

  const { state, user, ...body } = req.body;

  const productDB = await Product.findOne({name: body.name});

  if (productDB){
    return res.status(400).json({
      msg: `El producto ${ productDB.name }, ya existe`
    })
  }

  // Manipulated data for save in DB
  const data = {
    ...body,
    name: body.name.toUpperCase(),
    user: req.userAuth._id
  }

  const product = new Product(data);

  // Save in DB
  await product.save()

  res.status(201).json(product);

};

const updateProduct = async (req = request, res = response) => {

  const { id } = req.params;

  const { state, user, ...data } = req.body;

  if(data.name){
    // Manipulated data for save in DB
    data.name = data.name.toUpperCase();
  }

  data.userAuth = req.userAuth._id


  const product = await Product.findByIdAndUpdate( id, data, {new: true} );

  res.status(200).json(product);
}

const deleteProduct = async (req, res = response) => {

  const { id } = req.params;
  const product = await Product.findByIdAndUpdate( id, { state : false }, {new: true} );

  res.status(200).json(product);
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
