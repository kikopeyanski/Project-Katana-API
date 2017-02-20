const path = require('path');
const rootPath = path.normalize(path.join(__dirname, '/../../'));
const PORT = process.env.PORT || 1337;

module.exports = {
    development: {
        rootPath: rootPath,
        //connectionString: 'mongodb://Admin:junkies1234@ds141098.mlab.com:41098/funfact-project',
        connectionString: 'mongodb://localhost:27017/KatanaDb', //use this if you are in the holy Academy
        port: PORT,
        secret: 'magicstring'
    },
    production: {
        rootPath: rootPath,
        connectionString: process.env.CONNECTION_STRING,
        port: PORT,
        secret: process.env.JWT_SECRET
    }
};