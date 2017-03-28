/* globals module, require */
const moment = require('moment');
let weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
'use strict';
let getCourseLectures = function (course) {
    return new Promise((resolve, reject) => {
        let homeworkCount = 0;
        course.lectures.forEach(function (lecture) {
            if (lecture.homework) {
                homeworkCount++;
            }
        });
        course.homeworkCount = homeworkCount;
        resolve(course.lectures);
    })
};
module.exports = (models) => {
    const {User} = models;
    const {Course} = models;

    return {
        getAll() {
            return new Promise((resolve, reject) => {
                User.find({}, (err, user) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(user);
                });
            });
        },
        getUserById(userId) {
            return new Promise((resolve, reject) => {
                User.findOne({_id: userId}, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        },
        getUserByEmail(email) {
            return new Promise((resolve, reject) => {
                User.findOne({email}, (err, user) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(user);
                });
            });
        },
        getByUsername(username) {
            return new Promise((resolve, reject) => {
                User.findOne({username: username}, (err, user) => {

                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        },
        createUser(username, passHash, email, salt, img) {
            let user = new User({
                username: username,
                passHash: passHash,
                email: email,
                salt: salt,
                image: img,
                roles: ['regular']
            });

            return new Promise((resolve, reject) => {
                user.save((err) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        },
        addCourseToUser(username, courseId) {
            return new Promise((resolve, reject) => {
                this.getByUsername(username)
                    .then(user => {
                        if (user.courses.indexOf(courseId) == -1) {

                            user.courses.push(courseId);
                            user.save();

                            Course.findOne({_id: courseId}, (err, course) => {
                                course.studentsSigned += 1;
                                course.save();
                            });
                            resolve(user);
                        } else {
                            reject('user is already signed for this course');
                        }
                    });
            })
        },
        removeCourseFromUser(username, courseId){
            return new Promise((resolve, reject) => {
                this.getByUsername(username)
                    .then(user => {
                        let indexOfCourse = user.courses.indexOf(courseId);
                        user.courses.splice(indexOfCourse, 1);
                        user.save();

                        resolve(`${courseId} successfully unsigned`);
                    })
            })
        },
        getUserCourses(username) {
            return new Promise((resolve, reject) => {
                this.getByUsername(username)
                    .then(user => {
                        let coursesIds = [];
                        user.courses.forEach(function (courseId) {
                            coursesIds.push(courseId);
                        });

                        Course.find({'_id': {$in: coursesIds}}).sort({startDate: '-1'}).limit(4).exec((err, courses) => {
                            courses.forEach(function (course) {
                                let homeworkCount = 0;
                                let soonestHomework = moment().add(30, 'days');
                                course.lectures.forEach(function (lecture) {
                                    if (lecture.homework) {
                                        homeworkCount++;

                                        if (moment(lecture.homework.deadline).isBefore(soonestHomework)
                                            && moment(lecture.homework.deadline)
                                                .diff(moment(), 'days') >= 0) {
                                            soonestHomework = lecture.homework.deadline;
                                        }
                                    }
                                });

                                let daysTillHomework = moment(soonestHomework)
                                    .diff(moment(), 'days');
                                switch (daysTillHomework) {
                                    case 0:
                                        daysTillHomework = 'Today';
                                        break;
                                    case 1:
                                        daysTillHomework = 'Tomorrow';
                                        break;
                                    case 29:
                                        daysTillHomework = 'Don\'t worry, it\' not soon';
                                        break;
                                    case 30:
                                        daysTillHomework = 'Don\'t worry, it\' not soon';
                                        break;
                                    default:
                                        daysTillHomework = `After ${daysTillHomework} days`;
                                        break;
                                }
                                course.soonestHomework = daysTillHomework;
                                course.homeworkCount = homeworkCount;
                            });
                            resolve(courses);
                        });
                    });


            });

        },
        getUserHomewrok(courses){
            return new Promise((resolve, reject) => {
                let homeworkCount = 0;
                courses.forEach(function (course) {
                    course.lectures.forEach(function (lecture) {
                        if (lecture.homework) {
                            homeworkCount++;
                        }
                    })
                });
                resolve(homeworkCount);
            })
        },
        formatCalendar(data)
        {
            return new Promise((resolve, reject) => {
                let result = [];
                const fixedDate = '14-03-2017';

                for (let i = 0; i < 5; i++) {
                    let counter = moment().add(i, 'days');
                    let tmp = {};
                    tmp.date = weekdays[(moment().get('weekday') + i - 1) % 7];


                    let count = 1;


                    data.forEach(function (obj) {
                        if (moment(obj.lecture.date).day() == counter.day()) {
                            // console.log(obj.lecture.name +
                            //     ' ' + 'today ' + i);
                            tmp[`name${count}`]
                                = obj.lecture.name;
                            tmp[`start${count}`]
                                = moment(`${fixedDate} ${obj.lecture.endHour}`, 'DD-MM-YYYY HH:mm').utc();

                            tmp[`end${count}`]
                                = moment(`${fixedDate} ${obj.lecture.startHour}`, 'DD-MM-YYYY HH:mm').utc();
                            tmp[`color${count}`]
                                = obj.course.color;
                            count++;
                        }
                        if (moment(obj.lecture.homework.deadline).day() == counter.day()) {
                            tmp[`homework1`]
                                = moment(`${fixedDate} 19:00`, 'DD-MM-YYYY HH:mm').utc();
                            tmp[`homework2`]
                                = moment(`${fixedDate} 20:00`, 'DD-MM-YYYY HH:mm').utc();
                        }
                    });
                    result.push(tmp);
                }
                resolve(result);
            })
        }
        ,
        getUserCalendar(username)
        {
            return new Promise((resolve, reject) => {
                let result = [];
                this.getUserCourses(username)
                    .then(courses => {
                        courses.forEach(function (course) {
                            getCourseLectures(course)
                                .then(lectures => {
                                    lectures.forEach(function (lecture) {
                                        if (moment(lecture.date).isBetween(moment().day(), moment().add(5, 'days'))) {
                                            result.push({
                                                course: course,
                                                lecture: lecture
                                            });
                                        }
                                    })
                                })
                        });
                    })
                    .then(() => {
                        resolve(result);
                    })
            })
        },
        getUserFullCalendar(username){
            return new Promise((resolve, reject) => {
                let result = [];
                this.getUserCourses(username)
                    .then(courses => {
                        courses.forEach(function (course) {
                            getCourseLectures(course)
                                .then(lectures => {
                                    lectures.forEach(function (lecture) {
                                        result.push({
                                            course: course,
                                            lecture: lecture
                                        });
                                    })
                                })
                        });
                    })
                    .then(() => {
                        resolve(result);
                    })
            })
        },
        uploadAvatar(username, img, password)
        {
            return new Promise((resolve, reject) => {
                this.getByUsername(username)
                    .then(user => {
                        let passHashFromReq = user.generatePassHash(password);
                        if (passHashFromReq !== user.passHash) {
                            return reject();
                        }

                        user.image = img;
                        user.save();
                        resolve(user);
                    });
            });
        }
        ,
        getAvatar(username)
        {
            return new Promise((resolve, reject) => {
                this.getByUsername(username)
                    .then(result => {
                        resolve(result.avatar);
                    });
            });
        }
        ,
        updateUserPrivateInfo(id, info)
        {

            return new Promise((resolve, reject) => {
                Promise.all([this.getUserById(id), this.getUserByEmail(info.email)])
                    .then(([userFromId, userFromMail]) => {
                        if (userFromMail) {
                            reject(userFromId);
                        }

                        userFromId.passHash = info.passHash || userFromId.passHash;
                        userFromId.email = info.email || userFromId.email;

                        userFromId.save();
                        resolve(userFromId);
                    });

            });
        },
        notificationSeen(username, id){
            return new Promise((resolve, reject) => {
                this.getByUsername(username)
                    .then(user => {
                        user.notifications.forEach(function (notification) {
                            if (notification._id == id) {
                                notification.seen = true;
                                user.save();
                                resolve();
                            }

                        })
                    })
            })
        }
    };
};