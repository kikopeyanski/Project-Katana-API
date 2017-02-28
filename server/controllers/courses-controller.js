'use strict';

module.exports = function ({data, encryption}) {
    return {
        _validateToken(req, res) {
            let token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'You must be loged in order to use the tool'
                });
            }
            token = token.substring(1, token.length - 1);
            let user = encryption.deciferToken(token);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'You must be loged in order to use the tool'
                });
            }
        },
        getAllCourses(req, res) {
            this._validateToken(req, res);

            data.getAllCourses()
                .then(result => {
                    res.status(200).json(result);
                })
        },
        createCourse(req, res){
            let body = req.body;
            data.createCourse(body)
                .then((course) => {
                    res.status(200).json(`${course} successfully created `);
                })

         },
        // uploadFact(req, res, img) {
        //     this._validateToken(req, res);
        //
        //     let uploader = req.body.username;
        //     let title = req.body.title;
        //     let category = req.body.category;
        //
        //
        //     data.createFact({title, uploader, img, category})
        //         .then(fact => {
        //             res.json({isUploaded: true});
        //         });
        //
        // },
        getCourseById(req, res) {
            let id = req.params.id;
            data.getCourseById(id).then(result => {
                res.status(200).json(result);
            });
        },
        getFactComments(req, res) {
            let id = req.params.id;

            data.getFactComments(id)
                .then(result => res.status(200).json(result));
        },
        addComment(req, res) {
            let id = req.params.id;
            let comment = req.body.comment;


            data.addComment(id, comment);
            res.json(comment);
        },
        rateFact(req, res) {
            let id = req.params.id;
            let user = req.user;

            if (!req.body.vote) {
                res.status(400).json({
                    succes: false,
                    message: 'You must provide rating value!'
                });
                return;
            }

            let vote = +req.body.vote;

            if (vote < 0 || vote > 5) {
                res.send(400).json({
                    success: false,
                    message: 'Vote value must be bewteen 1 and 5'
                });

                return;
            }

            data.rateFact(id, user.username, vote)
                .then(fact => {
                    res.status(201)
                        .json({
                            succes: true,
                            message: 'Vote has been added successfuly',
                            rate: fact.rating
                        });
                });

        },
        voteForKnowledge(req, res) {
            let vote = req.body.vote;
            let id = req.params.id;
            if (vote === 'yes') {
                data.voteYes(id)
                    .then(result => {
                        res.status(200).json(result);
                    });
            } else {
                data.voteNo(id)
                    .then(result => {
                        res.status(200).json(result);
                    });
            }

        }
    };
};