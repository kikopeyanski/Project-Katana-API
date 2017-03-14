/* globals module, require */
const moment = require('moment');
let weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
'use strict';
let getCourseLectures = function (course) {
    return new Promise((resolve, reject) => {
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
                        user.courses.push(courseId);
                        user.save();
                        resolve(user);
                    });
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
                        Course.find({'_id': {$in: coursesIds}}, (err, courses) => {
                            resolve(courses);
                        });
                    });


            });

        },
        formatCalendar(data){
            return new Promise((resolve, reject) => {
                let result = [];
                const fixedDate = '14-03-2017';

                for (let i = 0; i < 5; i++) {
                    let counter = moment().add(i, 'days');
                    let tmp = {};
                    tmp.date = weekdays[moment().get('weekday') + i - 1];

                    let count = 1;


                    data.forEach(function (obj) {
                        if (moment(obj.lecture.date).day() == counter.day()) {
                            // console.log(obj.lecture.name +
                            //     ' ' + 'today ' + i);

                            tmp[`start${count}`]
                                = moment(`${fixedDate} ${obj.lecture.endHour}`, 'DD-MM-YYYY HH:mm').utc() ;

                            tmp[`end${count}`]
                                = moment(`${fixedDate} ${obj.lecture.startHour}`, 'DD-MM-YYYY HH:mm').utc();
                            count++;
                        }
                    });

                    result.push(tmp);
                    //todo
                }
                resolve(result);
            })
        },
        getUserCalendar(username){
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
        uploadAvatar(username, img, password) {
            return new Promise((resolve, reject) => {
                this.getByUsername(username)
                    .then(user => {
                        let passHashFromReq = user.generatePassHash(password);
                        if (passHashFromReq !== user.passHash) {
                            return reject();
                        }

                        user.avatar = img;
                        user.save();
                        resolve(user);
                    });
            });
        },
        getAvatar(username) {
            return new Promise((resolve, reject) => {
                this.getByUsername(username)
                    .then(result => {
                        resolve(result.avatar);
                    });
            });
        },
        updateUserPrivateInfo(id, info) {

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
        }
    };
};