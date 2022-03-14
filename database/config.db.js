const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
      await mongoose.connect(process.env.MONGODB_CNN);

      console.log('BD online connection');

  } catch (err) {
      console.log(err);
      throw new Error('Error while connecting to MongoDB');
  }
}


module.exports = {
    dbConnection
}
