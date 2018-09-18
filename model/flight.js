"use strict";
var mongoose = require('mongoose');
var Promise = require('bluebird');
const moment = require('moment');
Promise.promisifyAll(mongoose);
var mongoose = require('mongoose');

var flightSchema = new mongoose.Schema({
    source: String,
    destination: String,
    sourceCode: String,
    destinationCode: String,
    created_on: Date,
    dateOfDeparture: Date,
    slug: String,
    flightDetails: [{
        airline_name: String,
        flight_code: String,
        fare: String,
        tax: String,
        totalFare: String,
        depDate: String,
        depTime: String,
        travelDuration: String
    }]
}, { versionKey: false });

var flight = mongoose.model('flightsNew', flightSchema);
module.exports = flight;