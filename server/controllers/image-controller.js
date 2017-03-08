'use strict';

module.exports = function ({grid,database}) {
    return {
        getImage(req, res) {
            let gfs = grid(database.connection.db,database.mongo);

            let options = {
                _id: req.params.id
            };

            gfs.exist(options, (_,exists)=>{
                if(!exists){
                    res.status(404);
                    res.end();
                }
                let readstream = gfs.createReadStream(options);

                res.set('Content-Type','image/jpeg');

                readstream.pipe(res);
            })

        }
    };
};