/*globals */
'use strict';

const passport = require('passport');
const router = require('express').Router();
const auth = require('../config/auth');

module.exports = function ({  app, controllers }) {
    const adminController = controllers.admin;

    router
        .get('/users/all', auth.isAuthenticated(), auth.isInRole('admin'), adminController.getAllusers)
        .put('/users/user/:id', auth.isAuthenticated(), auth.isInRole('admin'), adminController.toggleBlockUsers)
        .post('/users/makeadmin/:id', auth.isAuthenticated(), auth.isInRole('admin'), adminController.makeUserAdmin)
        .get('/facts/deleted', auth.isAuthenticated(), auth.isInRole('admin'), adminController.getDeletedFacts)
        .delete('/facts/fact/:id', auth.isAuthenticated(), auth.isInRole('admin'), adminController.deleteFact)
        .put('/facts/fact/:id', auth.isAuthenticated(), auth.isInRole('admin'), adminController.restoreDeletedFact);

    app.use('/api/admin', router);
};