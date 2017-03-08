'use strict';

const router = require('express').Router();

module.exports = function ({app, controllers}) {
    const image = controllers.image;

    router
        .get('/image/:id', image.getImage);

    app.use(router);
};