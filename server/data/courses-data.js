/*globals module Promise*/
'use strict';
//const helper = require('../utils/helper');

module.exports = function (models) {
    let Course = models.Course;

    return {
        getAllCourses: function () {
            return new Promise((resolve, reject) => {
                Course.find({}, (err, courses) => {
                    if (err) {
                        return reject(err)
                    }

                    return resolve(courses.docs);
                })
            });
        },
        createCourse: function (body) {
            return new Promise((resolve, reject) => {
                let courseName = body.name;


                const course = new Course({
                    name: courseName
                });

                course.save((err) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(courseName);
                })
            })
        }
    }
};