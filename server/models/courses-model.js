/*globals module require*/

'use strict';

const mongoose = require('mongoose');

let courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'No info for this course'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
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
        }],
        default: []
    },
    studentsSigned: {
        type: Number,
        default: 0
    },
    studentsLimit: {
        type: Number,
        default: 150
    },
    comments: {
        type: [{
            user: {
                name: String,
                avatar: String
            },
            content: String,
            date: Date
        }]
    }
});


mongoose.model('Course', courseSchema);
module.exports = mongoose.model('Course');