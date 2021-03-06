'use strict';
const userDataExtractor = require('../utilities/user-data-extractor');

module.exports = function ({data, encryption, grid, database}) {
    return {
        _validateToken(req, res) {
            let token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'You must be loged in order to vote'
                });
            }
            token = token.substring(1, token.length - 1);
            let user = encryption.deciferToken(token);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'You must be loged in order to vote'
                });
            }
        },
        getUserCourses(req, res) {
            let username = req.params.username;
            let user = userDataExtractor.extractUserData(req);
            let calendar;
            data.getUserCalendar(username)
                .then(result => {
                    data.formatCalendar(result)
                        .then(result => {
                            calendar = result;
                        })
                })
                .then(() => {
                    if (req.user.username != username) {
                        res.status(401).json({
                            success: false,
                            message: 'Unauthorized'
                        })
                    }
                    data.getUserCourses(username)
                        .then((result) => {
                            res.status(200).json({
                                user: user,
                                result: result,
                                calendar: calendar
                            })
                        });
                })

        },
        getUserCalendar(req, res){
            let username = req.params.username;
            let calendar;
            data.getUserFullCalendar(username)
                .then(result => {
                    res.status(200).json({
                        calendar: result
                    })
                })
                .catch(err => {
                    res.status(404).json(err);
                })

        },
        addCourseToUser(req, res){
            let username = req.params.username;
            let courseId = req.body.id;


            data.addCourseToUser(username, courseId)
                .then(function () {
                    res.status(200);
                })


        },
        removeCourseFromUser(req, res){
            let username = req.params.username;
            let courseId = req.body.id;

            data.removeCourseFromUser(username, courseId)
                .then(result => {
                    res.status(200).json(result);
                })
        },
        updatePrivateInfo(req, res) {
            if (!req.user) {
                res.status(401).json({
                    succes: false,
                    message: 'Please enter your credentials'
                });
                return;
            }

            let user = req.user;
            let userHash = req.user.passHash;

            let hashedEnteredPassword = user.generatePassHash(req.body.currentPassword);
            if (userHash !== hashedEnteredPassword) {
                res.status(401).json({
                    succes: false,
                    message: 'Please enter valid credentials'
                });
                return;
            }

            let newUserHash = false;

            if (req.body.newPassword) {
                newUserHash = user.generatePassHash(req.body.newPassword);
            }

            let infoToUpdate = {
                email: req.body.email,
                passHash: newUserHash
            };

            data.updateUserPrivateInfo(user._id, infoToUpdate)
                .then(result => {
                    res.status(201).json({
                        succes: true,
                        message: 'Userinfo has been updated successfullyF'
                    });
                })
                .catch(err => {
                    res.status(400).json({
                        succes: false,
                        message: 'User with the same email already exists!'
                    });
                });
        },
        uploadAvatar(req, res) {
            let username = req.params.username;
            let passwordFromReq = req.body.password;

            if (!passwordFromReq) {
                res.status(401).json({
                    succes: false,
                    message: 'Password is not valid'
                });
            }

            let gfs = grid(database.connection.db, database.mongo);
            let file = req.file;
            let img;

            gfs.writeFile({}, file.buffer, (_, foundFile) => {
                img = foundFile._id;

                data.uploadAvatar(username, img, passwordFromReq)
                    .then(user => {
                        res.status(200).json(user.image);
                    })
                    .catch((err) => {
                        res.status(401).json({
                            succes: false,
                            message: 'Password is not valid'
                        });
                    });
            });


        },
        notificationSeen(req, res){
            let username = req.params.username;
            let id = req.body.id;

            data.notificationSeen(username, id)
                .then(res.status(200).json('success'))
        }
        // getAvatar(req, res) {
        //     let username = req.params.username;
        //
        //     data.getAvatar(username)
        //         .then(result => res.status(200).json(result));
        // }
    };
};