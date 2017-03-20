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
                let result = {
                    firstModule: [],
                    secondModule: [],
                    thirdModule: [],
                    noModule: []
                };

                Course.find({}, (err, courses) => {
                    if (err) {
                        return reject(err)
                    }
                    courses.forEach(function (course) {
                        switch (course.module) {
                            case '1':
                                result.firstModule.push(course);
                                break;
                            case '2':
                                result.secondModule.push(course);
                                break;
                            case '3':
                                result.thirdModule.push(course);
                                break;
                            default:
                                result.noModule.push(course);
                                break;
                        }
                    });

                    return resolve(result);
                })
            });
        },
        createCourse: function (body) {
            return new Promise((resolve, reject) => {
                let courseName = body.name;
                let description = body.description;
                let module = body.module;
                let track = body.track;
                //default color if something happens
                let color = '#ff0000';
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
                    description: description,
                    track: track,
                    module: module,
                    startDate: startDate,
                    endDate: endDate,
                    homework: homework,
                    image: img,
                    color: color
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
        },
        addComment(id, user, content){
            return new Promise((resolve, reject) => {
                Course.findOne({_id: id}, (err, course) => {
                    console.log(content);
                    let comment = {
                        user: user,
                        content: content,
                        date: Date.now()
                    };
                    course.comments.push(comment);
                    course.save();
                    resolve(comment);
                })
            })
        }

    }
};