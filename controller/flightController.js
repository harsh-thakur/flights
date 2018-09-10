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
  cronTime: "55 26 09 * * 0-6",
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
      destinationCode: 'BOM',
      sourceName: 'New Delhi',
      destinationName: 'Mumbai'
    },
    {
      sourceCode: 'DEL',
      destinationCode: 'BLR',
      sourceName: 'New Delhi',
      destinationName: 'Bengaluru'
    },
    {
      sourceCode: 'DEL',
      destinationCode: 'HYD',
      sourceName: 'New Delhi',
      destinationName: 'Hyderabad'
    },
    {
      sourceCode: 'DEL',
      destinationCode: 'IXC',
      sourceName: 'New Delhi',
      destinationName: 'Chandigarh'
    },
    {
      sourceCode: 'DEL',
      destinationCode: 'MAA',
      sourceName: 'New Delhi',
      destinationName: 'Chennai'
    },

    // 1st set
    {
      sourceCode: 'BOM',
      destinationCode: 'DEL',
      sourceName: 'Mumbai',
      destinationName: 'New Delhi'
    },
    {
      sourceCode: 'BOM',
      destinationCode: 'BLR',
      sourceName: 'Mumbai',
      destinationName: 'Banglore'
    },
    {
      sourceCode: 'BOM',
      destinationCode: 'HYD',
      sourceName: 'Mumbai',
      destinationName: 'Hyderabad'
    },
    {
      sourceCode: 'BOM',
      destinationCode: 'IXC',
      sourceName: 'Mumbai',
      destinationName: 'Chandigarh'
    },
    {
      sourceCode: 'BOM',
      destinationCode: 'MAA',
      sourceName: 'Mumbai',
      destinationName: 'Chennai'
    },
    // 2nd set 
    {
      sourceCode: 'BLR',
      destinationCode: 'DEL',
      sourceName: 'Bangalore',
      destinationName: 'Delhi'
    },
    {
      sourceCode: 'BLR',
      destinationCode: 'BOM',
      sourceName: 'Bangalore',
      destinationName: 'Mumbai'
    },
    {
      sourceCode: 'BLR',
      destinationCode: 'HYD',
      sourceName: 'Bangalore',
      destinationName: 'Hyderabad'
    },
    {
      sourceCode: 'BLR',
      destinationCode: 'IXC',
      sourceName: 'Bangalore',
      destinationName: 'Chandigarh'
    },
    {
      sourceCode: 'BLR',
      destinationCode: 'MAA',
      sourceName: 'Bangalore',
      destinationName: 'Chennai'
    },
    // 3rd set 
    {
      sourceCode: 'HYD',
      destinationCode: 'DEL',
      sourceName: 'Hyderabad',
      destinationName: 'Delhi'
    },   
    {
      sourceCode: 'HYD',
      destinationCode: 'BOM',
      sourceName: 'Hyderabad',
      destinationName: 'Mumbai'
    },
    {
      sourceCode: 'HYD',
      destinationCode: 'BLR',
      sourceName: 'Hyderabad',
      destinationName: 'Banglore'
    },
    {
      sourceCode: 'HYD',
      destinationCode: 'IXC',
      sourceName: 'Hyderabad',
      destinationName: 'Chandigarh'
    },
    {
      sourceCode: 'HYD',
      destinationCode: 'MAA',
      sourceName: 'Hyderabad',
      destinationName: 'Chennai'
    },

    // // 4th set
    {
      sourceCode: 'IXC',
      destinationCode: 'DEL',
      sourceName: 'Chandigarh',
      destinationName: 'Delhi'
    },
    {
      sourceCode: 'IXC',
      destinationCode: 'BOM',
      sourceName: 'Chandigarh',
      destinationName: 'Mumbai'
    },
    {
      sourceCode: 'IXC',
      destinationCode: 'BLR',
      sourceName: 'Chandigarh',
      destinationName: 'Banglore'
    },
    {
      sourceCode: 'IXC',
      destinationCode: 'HYD',
      sourceName: 'Chandigarh',
      destinationName: 'Hyderabad'
    },
    {
      sourceCode: 'IXC',
      destinationCode: 'MAA',
      sourceName: 'Chandigarh',
      destinationName: 'Chennai'
    },

    // 5th set 
    {
      sourceCode: 'MAA',
      destinationCode: 'DEL',
      sourceName: 'Chennai',
      destinationName: 'New Delhi'
    },
    {
      sourceCode: 'MAA',
      destinationCode: 'BOM',
      sourceName: 'Chennai',
      destinationName: 'Mumbai'
    },
    {
      sourceCode: 'MAA',
      destinationCode: 'BLR',
      sourceName: 'Chennai',
      destinationName: 'Banglore'
    },
    {
      sourceCode: 'MAA',
      destinationCode: 'HYD',
      sourceName: 'Chennai',
      destinationName: 'Hyderabad'
    },
    {
      sourceCode: 'MAA',
      destinationCode: 'IXC',
      sourceName: 'Chennai',
      destinationName: 'Chandigarh'
    }

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
            flightDetails: detailArr
          }
          let obj = await new flight(clubbed);

          let ans = await obj.save();
          if (!ans) {
            return response.statusCode;
          } else { 
              console.log("data saved");
              
            return response.statusCode; }

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


function sendMail() {
  console.log("come here to send mail");
  let i =10;
  let msg = {
    to:'harsh.singh@venturepact.com',
    from:'hacked@hack.com',
    subject:'Hacked',
    text: i>10 ? "Worked":"Didnot"
  }
  sgMail.send(msg).then(()=>{
    console.log("kaam ho gya");
    
  })
  }