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
                    console.log(courses);
                    return resolve(courses);
                })
            });
        },
        createCourse: function (body) {
            return new Promise((resolve, reject) => {
                let courseName = body.name;
                let startDate = body.startDate;
                let endDate = body.endDate;

                const course = new Course({
                    name: courseName,
                    startDate: startDate,
                    endDate: endDate
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