'use strict';

module.exports = function ({data}) {
    return {
        getAllusers(req, res) {

            data.getAllUsers()
                .then(users => {
                    res.status(200).json({
                        success: true,
                        data: users
                    });
                });
        },
        deleteFact(req, res) {
            let factId = req.params.id;

            data.deleteFactById(factId)
                .then(result => {
                    res.status(201).json({
                        success: true,
                        message: 'Fact was deleted succesfully!'
                    });
                });
        },
        getDeletedFacts(req, res) {

            data.getDeletedFacts()
                .then(facts => {
                    res.status(200).json({
                        succes: true,
                        data: facts
                    });
                });
        },
        restoreDeletedFact(req, res) {
            let factToRestoreId = req.params.id;

            data.restoreDeletedFact(factToRestoreId)
                .then(fact => {
                    res.status(201).json({
                        succes: true,
                        message: 'Fact has been restored'
                    });
                });
        },
        toggleBlockUsers(req, res) {
            let userId = req.params.id;

            data.toggleBlockUser(userId)
                .then(result => {
                    res.status(201).json({
                        succes: true,
                        message: 'Operation succesfull',
                        data: result
                    });
                })
                .catch(err => {
                    res.status(401).json({
                        succes: false,
                        message: 'Admins can not block other admins'
                    });
                });
        },
        makeUserAdmin(req, res) {
            let userId = req.params.id;

            data.makeUserAdmin(userId)
                .then(result => {
                    res.status(201).json({
                        succes: true,
                        message: 'Operation succesfull',
                        data: result
                    });
                })
                .catch(err => {
                    res.status(401).json({
                        succes: false,
                        message: ''
                    });
                });
        }
    };
};