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
        required: true,
        default: Date.now()
    },
    homework: {
        type: [{
            name: {
                type: String,
                required: true
            }
        }],
        required: false,
        default: []
    }
});


mongoose.model('Course', courseSchema);
module.exports = mongoose.model('Course');