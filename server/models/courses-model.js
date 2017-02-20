/*globals module require*/

'use strict';

const mongoose = require('mongoose');

let courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    endDate: {
        type: Date,
        require: true,
        default: Date.now()
    },
    homework: {
        type: {
            name: {
                type: String,
                require: true
            },
            endDate: {
                type: Date,
                required: true
            }
        },
        require: false
    }
});


mongoose.model('Course', courseSchema);
module.exports = mongoose.model('Course');