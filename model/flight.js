"use strict";
var mongoose = require('mongoose');
var Promise = require('bluebird');
const moment = require('moment');
Promise.promisifyAll(mongoose);
var mongoose = require('mongoose');

var flightSchema = new mongoose.Schema({
        source:String,
        destination:String,
        sourceCode:String,
        destinationCode: String,
        dateOfDeparture:Date,
        details :[{
           airline_name:String,
            flight_code:String,
            fare:String,
            tax:String,
            totalFare:String,
            depDate:Date,
            travelDuration:String
        }]
 }, { versionKey: false });

var flight = mongoose.model('flightibibo', flightSchema);
module.exports = flight;