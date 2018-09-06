require("dotenv").config();
const request = require('request');
var flight = require('../model/flight')
var mongoose = require("mongoose");
var Promise = require("bluebird");
const async = require('async');
let CronJob = require("cron").CronJob;
const moment = require("moment");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API);
sgMail.setSubstitutionWrappers("{{", "}}");

let recC = 0;
var notifier = new CronJob({
  cronTime: "00 05 10 * * 0-6",
  // cronTime: '1 * * * * *',
  onTick: async function () {
    // if (process.env.Is_Dev_Machine != 1) {
    // }
    crawl();
    // sendMail();

  },
  start: false,
  timeZone: "Asia/Kolkata"
});
notifier.start();



async function crawl() {
  console.log("heloo cron activated");
  let pairOfOriginDestination = [
    {
      sourceCode: 'DEL',
      destinationCode: 'BLR',
      sourceName: 'New Delhi',
      destinationName: 'Bengaluru'
    },
    {
      sourceCode: 'BLR',
      destinationCode: 'DEL',
      sourceName: 'Bengaluru',
      destinationName: 'New Delhi'
    },
    {
      sourceCode: 'DEL',
      destinationCode: 'GOI',
      sourceName: 'New Delhi',
      destinationName: 'Goa'
    },
    {
      sourceCode: 'GOI',
      destinationCode: 'DEL',
      sourceName: 'Goa',
      destinationName: 'New Delhi'
    },
  ]

    for(let i=0;i<pairOfOriginDestination.length;i++)
    {
  
      let element = pairOfOriginDestination[i];
     
    check(element,element.sourceCode,element.destinationCode)
    .then(data=>{
      console.log(data); 
    });
  }
}



async function check(element,src,des){
  let date = moment().format('YYYYMMDD')
  var status = 502;
  let ibiboApi = `http://developer.goibibo.com/api/search/?app_id=f07bdf95&app_key=`+process.env.IBIBO_API_KEY+`&format=json&source=`+src+`&destination=`+des+`&dateofdeparture=`+date+`&seatingclass=E&adults=1&children=0&infants=0&counter=100`
     await request({
        method: 'GET',
        uri: ibiboApi
      }, async function (error, response, body) {
        // console.log('res codesss',response.statusCode)
        if (!error && response.statusCode == 200) {
          body = JSON.parse(body);    
          status = 200
          let ibiboData = body.data.onwardflights;
          let detailArr = [];
          await ibiboData.forEach(async function (el) {
            let ob = {
              airline_name: el.airline,
              flight_code: el.carrierid,
              fare: el.fare.adultbasefare,
              tax: el.fare.adulttax,
              totalFare: el.fare.adulttotalfare,
              depDate: new Date(),
              travelDuration: el.duration
            }
            detailArr.push(ob);
          })
          let clubbed = {
            source: element.sourceName,
            destination: element.destinationName,
            sourceCode: element.sourceCode,
            destinationCode: element.destinationCode,
            dateOfDeparture: Date.now(),
            slug:element.sourceName.toLowerCase()+'-'+element.destinationName.toLowerCase(),
            details: detailArr
          }
          let obj = await new flight(clubbed);

          let ans = await obj.save();
          if (!ans) {
            return response.statusCode;
          } else { return response.statusCode; }

        }
        else{
          recC++;   
          if(status!=200)
           { check(element,src,des);  }
          else{
            status = 502
          } 
        }
      })
}


// function sendMail() {
//   console.log("come here to send mail");
  
//   let msg = {
//     to:'sonia.dua@venturepact.com',
//     from:'hacked@hack.com',
//     subject:'Hacked',
//     text: 'Your acoount has been hacked!'
//   }
//   sgMail.send(msg).then(()=>{
//     console.log("kaam ho gya");
    
//   })
//   }