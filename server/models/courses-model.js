/*globals module require*/

'use strict';

const mongoose = require('mongoose');

let courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    module: {
        type: String,
        default: 4
    },
    order: {
        type: Number,
        default: 5
    },
    track: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: false
    },
    homeworkCount: {
        type: Number
    },
    soonestHomework: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    lectures: {
        type: [{
            name: String,
            date: Date,
            startHour: String,
            endHour: String,
            homework: {
                name: String,
                deadline: Date
            }
        }]
    }
});


mongoose.model('Course', courseSchema);
module.exports = mongoose.model('Course');