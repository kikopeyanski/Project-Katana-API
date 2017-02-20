'use strict';

const router = require('express').Router();

module.exports = function ({app, controllers}) {
    const home = controllers.home;

    router
        .get('/', home.getHome);

    app.use(router);
};