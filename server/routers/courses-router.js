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

    const uploadFact = multer({
        storage: storageFact
    });


    router
        .post('/upload',upload.single('image'), courses.createCourse)
        // .post('/fact/:id/comments', auth.isAuthenticated(), auth.isBlocked(), facts.addComment)
        // .get('/fact/:id/comments', facts.getFactComments)
         .get('/course/:id',auth.isAuthenticated(), courses.getCourseById)
        // .put('/fact/:id', auth.isAuthenticated(), auth.isBlocked(), facts.rateFact)
        // .put('/fact/vote/:id', facts.voteForKnowledge)//TODO:Change  rate to vote
        .get('/all', (req, res) => {
            courses.getAllCourses(req,res)
        });

    app.use('/courses', router);
}
;