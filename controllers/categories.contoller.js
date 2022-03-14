const { response, request} = require("express");
const { Category } = require("../models");

const getCategories = async (req = request, res = response) => {

  const { limit = 5, start = 0 } = req.query;
  const state =  { state : true };

  const [totalCategories, categories,  ] = await Promise.all([
    Category.countDocuments(state),
    Category.find(state)
        .populate('user', 'name')
        .skip(Number(start))
        .limit(Number(limit)),
  ])

  res.json({
    totalCategories,
    categories
  });
};

const getCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const category =  await Category.findById(id).populate('user', 'name');

  res.json(category);
};

const createCategory = async (req = request, res = response) => {

  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({name});

  if (categoryDB){
    return res.status(400).json({
      msg: `La categoria ${categoryDB.name}, ya existe`
    })
  }

  // Manipulated data for save in DB
  const data = {
    name,
    user: req.userAuth._id
  }

  const category = new Category(data);

  // Save in DB
  await category.save()

  res.status(201).json(category);

};

const updateCategory = async (req = request, res = response) => {

  const { id } = req.params;

  const { state, user, ...data} = req.body;

  // Manipulated data for save in DB
  data.name = data.name.toUpperCase();
  data.userAuth = req.userAuth._id

  const category = await Category.findByIdAndUpdate( id, data, {new: true} );

  res.status(200).json(category);
}

const deleteCategory = async (req, res = response) => {

  const { id } = req.params;
  const category = await Category.findByIdAndUpdate( id, { state : false }, {new: true} );

  res.status(200).json(category);
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
