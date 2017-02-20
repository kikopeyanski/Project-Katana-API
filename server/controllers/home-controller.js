'use strict';

module.exports = function ({data}) {
    return {
        getHome(req, res) {
            data.getAllFactsWithoutPaging()
                .then(result => {
                    //let randomFact = result[Math.floor(Math.random() * Object.keys(result).length)];

                    res.send("I've found you");
                    //sres.status(200).json(randomFact);

                });
        }
    };
};