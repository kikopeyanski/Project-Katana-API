'use strict';
const multer = require('multer');
const path = require('path');
const router = require('express').Router();

module.exports = function ({app, controllers, passport, auth, upload}) {
    const courses = controllers.courses;
    let img = '';
    const storageFact = multer.diskStorage({
        destination: function (req, file, cb) {

            cb(null, path.join(__dirname, '../../public/images/fact-images/'));
        },
        filename: function (req, file, cb) {

            img = Date.now() + file.originalname;
            cb(null, img);
        }
    });


    router
        .post('/upload', upload.single('image'), courses.createCourse)
        .put('/course/:id',auth.isAuthenticated(), courses.addLectureToCourse)
        .get('/course/:id', auth.isAuthenticated(), courses.getCourseById)
        .get('/all', auth.isAuthenticated(), courses.getAllCourses);

    app.use('/courses', router);
};