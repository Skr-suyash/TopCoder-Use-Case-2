/**
 * Module to connect to the MongoDB Database
 */

const mongoose = require('mongoose');
const config = require('../../config.js');

const connectionURL = `mongodb://127.0.0.1:${config.dbPort}/${config.dbName}`;

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
