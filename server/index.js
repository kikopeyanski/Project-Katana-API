'use strict';

const express = require('express');

const app = express();
const stage = 'development'; //process.env.NODE_ENV ||
const config = require('./config/config')[stage];
const passport = require('passport');

const data = require('./data')();
const cors = require('cors');
const auth = require('./config/auth');
const database = require('./config/database')(config);
const grid = require('gridfs');
const multer = require('multer');

let storage = multer.memoryStorage();
      let upload = multer({storage: storage});

app.use(cors());

const encryption = require('./utilities/encryption');

require('./config/express')(config, app);
const controllers = require('./controllers')({ app, encryption, data, passport, grid, database});
require('./routers')({ app, controllers, passport, auth , upload});



app.listen(config.port, () => console.log('Server running at port : ' + config.port));
