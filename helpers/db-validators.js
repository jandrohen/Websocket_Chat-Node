const {Category, Role, User, Product} = require("../models");

const isRoleValid = async (role = '') => {
    const existRole = await Role.findOne({role});
    if (!existRole){
        throw new Error(`El rol ${ role } no existe en la BD`)
    }
}

const existEmail = async (email = '') => {
    // Check if the email exists
    const existEmail = await User.findOne({email});
    if (existEmail) {
        throw new Error(`El email: ${ email }, ya está registrado`);
    }
}

const existUserId = async ( id ) => {
    // Check if the ID user exists
    const existUser = await User.findById(id);
    if ( !existUser) {
        throw new Error(`El id: ${ id }, no existe en la BD`);
    }
}

const existCategoryId = async ( id ) => {
    // Check if the ID Category exists
    const existCategory = await Category.findById(id);
    if ( !existCategory ) {
        throw new Error(`El id: ${ id }, no existe en la BD`);
    }
}

const existProductId = async ( id ) => {
    // Check if the ID Category exists
    const existProduct = await Product.findById(id);
    if ( !existProduct ) {
        throw new Error(`El id: ${ id }, no existe en la BD`);
    }
}

const permittedCollection = async (collection= '', collections = []) => {
    const include = collection.includes(collection);
    if ( !include ) {
        throw new Error(`El colección: ${ collection }, no es permitida, ${collections}`);
    }
    return true;
}
module.exports = {
    isRoleValid,
    existEmail,
    existUserId,
    existCategoryId,
    existProductId,
    permittedCollection
}
