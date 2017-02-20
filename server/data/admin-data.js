/* globals module, require */
'use strict';

module.exports = (models) => {
    const { User, Fact } = models;

    return {
        getAllUsers() {
            return new Promise((resolve, reject) => {
                User.find({}, (err, user) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(user);
                });
            });
        },
        getDeletedFacts() {
            return new Promise((resolve, reject) => {
                Fact.find({ isDeleted: true }, (err, fact) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(fact);
                });
            });
        },
        restoreDeletedFact(id) {
            return new Promise((resolve, reject) => {
                Fact.findOne({ _id: id }, (err, foundFact) => {
                    if (err) {
                        return reject(err);
                    }

                    foundFact.isDeleted = false;
                    foundFact.save();
                    return resolve(foundFact);
                });
            });
        },
        toggleBlockUser(userId) {
            return new Promise((resolve, reject) => {
                User.findOne({ _id: userId }, (err, foundUser) => {
                    if (err) {
                        return reject(err);
                    }

                    if (foundUser.isAdmin) {
                        return reject();
                    }

                    foundUser.isBlocked = !foundUser.isBlocked;
                    foundUser.save();
                    return resolve(foundUser);
                });
            });
        },
        makeUserAdmin(userId) {
            return new Promise((resolve, reject) => {
                User.findOne({ _id: userId }, (err, foundUser) => {
                    if (err) {
                        return reject(err);
                    }

                    foundUser.assignRole('admin');
                    foundUser.save();
                    return resolve(foundUser);
                });
            });
        }
    };
};