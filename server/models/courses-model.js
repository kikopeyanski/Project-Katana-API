/*globals module require*/

'use strict';

const mongoose = require('mongoose');

let courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: true
    },
    lectures: {
        type: [{
            name: String,
            date: Date,
            startHour: Date,
            ednHour: Date,
            homework: {
                name: String,
                deadline: Date
            }
        }]
    }
});


mongoose.model('Course', courseSchema);
module.exports = mongoose.model('Course');