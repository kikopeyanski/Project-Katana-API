/* globals module, require */
'use strict';

module.exports = (models) => {
    const { User } = models;

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
                User.findOne({ _id: userId }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        },
        getUserByEmail(email) {
            return new Promise((resolve, reject) => {
                User.findOne({ email }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(user);
                });
            });
        },
        getByUsername(username) {
            return new Promise((resolve, reject) => {
                User.findOne({ username: username }, (err, user) => {

                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        },
        createUser(username, passHash, email, salt) {
            let user = new User({
                username: username,
                passHash: passHash,
                email: email,
                salt: salt,
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
        addFactToFavorites(username, fact) {
            this.getByUsername(username)
                .then(user => {
                    user.favoriteFacts.push(fact);
                    user.save();
                });
        },
        getUserFavorites(username) {
            return new Promise((resolve, reject) => {
                this.getByUsername(username)
                    .then(result => {
                        resolve(result.favoriteFacts);
                    });
            });
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