'use strict';
const multer = require('multer');
const path = require('path');
const router = require('express').Router();

module.exports = function ({app, controllers, passport, auth,upload}) {
    const user = controllers.user;

    router
        .get('/user/:username/courses', auth.isAuthenticated(), user.getUserCourses)
        .get('/user/:username/calendar', auth.isAuthenticated(), user.getUserCalendar)
        .post('/user/:username/courses',user.addCourseToUser)
        .put('/user/:username/courses/remove',user.removeCourseFromUser)
        .put('/user/:username/settings',auth.isAuthenticated(),user.updatePrivateInfo)
        .post('/user/:username/settings/avatar',auth.isAuthenticated(),upload.single('image'), user.uploadAvatar)
        .post('/user/:username/notifications',user.notificationSeen);
    app.use('/api/users', router);
    //  .get('/user/:username/avatar', auth.isAuthenticated(), userController.getAvatar)
    //   .post('/user/avatar', uploadAvatar.any(), (req, res) => {
    //       userController.uploadAvatar(req, res, img);
    //   });

};