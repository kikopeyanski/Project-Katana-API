/*globals module Promise*/
'use strict';
//const helper = require('../utils/helper');
let tracks = [
    {
        name: 'Web Frond-End Development',
        color: '#FF4500'
    },
    {
        name: 'QA Engineer',
        color: '#47111E'
    },
    {
        name: 'Mobile',
        color: '#FFF847'
    },
    {
        name: 'ASP.NET',
        color: '#1E90FF'
    },
    {
        name: 'School Academy',
        color: '#008542'
    }
];

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
                let track = body.track;
                let color;
                tracks.forEach(function (tr) {
                    if (tr.name == track) {
                        color = tr.color;
                    }
                });
                let startDate = body.startDate;
                let endDate = body.endDate;
                let homework = body.homework;
                let img = body.img;

                const course = new Course({
                    name: courseName,
                    track: track,
                    color: color,
                    startDate: startDate,
                    endDate: endDate,
                    homework: homework,
                    image: img
                });

                course.save((err) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(courseName);
                })
            })
        },
        getCourseById: function (id, userCourses) {
            return new Promise((resolve, reject) => {
                let result = {};
                result.course = {};

                result.isSigned = userCourses.indexOf(id) != -1;

                Course.findOne({_id: id}, (err, course) => {
                    result.course = course;
                    resolve(result)
                });
            })
        },
        addLectureToCourse(id, lecture){
            return new Promise((resolve, reject) => {
                Course.findOne({_id: id}, (err, course) => {
                    course.lectures.push(lecture);
                    course.save();
                    resolve('success');
                })
            })
        }

    }
};