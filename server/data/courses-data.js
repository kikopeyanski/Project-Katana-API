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
                    return resolve(courses);
                })
            });
        },
        createCourse: function (body) {
            return new Promise((resolve, reject) => {
                let courseName = body.name;
                let startDate = body.startDate;
                let endDate = body.endDate;
                let homework = body.homework;

                const course = new Course({
                    name: courseName,
                    startDate: startDate,
                    endDate: endDate,
                    homework: homework
                });

                course.save((err) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(courseName);
                })
            })
        },
        getCourseById: function (id) {
            return new Promise((resolve, reject) => {
                Course.findOne({_id: id}, (err, course) => {
                    return resolve(course);
                })
            })
        }

    }
};