const express = require('express')
const cors = require("cors");
const fileUpload = require('express-fileupload');

const {dbConnection} = require("../database/config.db");



class Server{

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            users: '/api/users',
            uploads: '/api/uploads',
        }

        // Connect to the DB
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Routes of the application
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Read and parse of the body
        this.app.use( express.json() );

        // Directory public
        this.app.use( express.static('public'));

        // Fileupload - upload of files and create dir if not exist
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {

        this.app.use(this.paths.auth, require('../routes/auth.router'));
        this.app.use(this.paths.categories, require('../routes/categories.router'));
        this.app.use(this.paths.products, require('../routes/products.router'));
        this.app.use(this.paths.search, require('../routes/search.router'));
        this.app.use(this.paths.users, require('../routes/users.router'));
        this.app.use(this.paths.uploads, require('../routes/uploads.router'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server listening on port', this.port);
        });
    }
}

module.exports = Server;
