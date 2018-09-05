const request = require('request');
var flight = require('../model/flight')
var mongoose = require("mongoose");
var Promise = require("bluebird");
const async = require('async');
let CronJob = require("cron").CronJob;
let recC = 0;
var notifier = new CronJob({
  cronTime: "39 17 14 * * 1-5",
  // cronTime: '1 * * * * *',
  onTick: async function () {
    // if (process.env.Is_Dev_Machine != 1) {
    // }
    crawl();

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

    //  pairOfOriginDestination.forEach(async element => {
    for(let i=0;i<pairOfOriginDestination.length;i++)
    {
  
      let element = pairOfOriginDestination[i];
     
    // console.log('thoda string - >',element);
    //  let resCode = await 
    check(element,element.sourceCode,element.destinationCode)
    .then(data=>{
      console.log(data); 
    });

    //  console.log('thoda string - >',resCode);
    //  console.log('bohot string - >',resCode);
     
      // setTimeout(() => {
    //   console.log('element', element);

     
      
      // let ibiboApi = `http://developer.goibibo.com/api/search/?app_id=f07bdf95&app_key=a217ca568eb8a71b84f678b77f50f522&format=json&source=${element.sourceCode}&destination=${element.destinationCode}&dateofdeparture=20180920&seatingclass=E&adults=1&children=0&infants=0&counter=100`

      // // let url = `https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${process.env.API_KEY}&origin=${el.sourceCode}&destination=${el.destinationCode}&departure_date=2018-09-06&nonstop=false&currency=INR`
      // request({
      //   method: 'GET',
      //   uri: ibiboApi
      // }, async function (error, response, body) {
      //   // if (!error && response.statusCode == 200) {
      //   //   body = JSON.parse(body);

      //   //   let ibiboData = body.data.onwardflights;
      //   //   let detailArr = [];
      //   //   await ibiboData.forEach(async function (el) {
      //   //     let ob = {
      //   //       airline_name: el.airline,
      //   //       flight_code: el.carrierid,
      //   //       fare: el.fare.adultbasefare,
      //   //       tax: el.fare.adulttax,
      //   //       totalFare: el.fare.adulttotalfare,
      //   //       depDate: new Date(),
      //   //       travelDuration: el.duration
      //   //     }
      //   //     detailArr.push(ob);
      //   //   })
      //   //   let clubbed = {
      //   //     source: element.sourceName,
      //   //     destination: element.destinationName,
      //   //     sourceCode: element.sourceCode,
      //   //     destinationCode: element.destinationCode,
      //   //     dateOfDeparture: Date.now(),
      //   //     details: detailArr
      //   //   }
      //   //   let obj = await new flight(clubbed);

      //   //   let ans = await obj.save();
      //   //   if (!ans) {
      //   //     console.log("something went wrong");
      //   //   } else { console.log('data saved successfully'); }
      //   // }
      //   // else{
      //   //   console.log('error occured', response.statusCode);
      //   // }
      // })
    // }, 5000)
  }
}



async function check(element,src,des){
  let ibiboApi = `http://developer.goibibo.com/api/search/?app_id=f07bdf95&app_key=a217ca568eb8a71b84f678b77f50f522&format=json&source=`+src+`&destination=`+des+`&dateofdeparture=20180920&seatingclass=E&adults=1&children=0&infants=0&counter=100`

      // let url = `https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${process.env.API_KEY}&origin=${el.sourceCode}&destination=${el.destinationCode}&departure_date=2018-09-06&nonstop=false&currency=INR`
     await request({
        method: 'GET',
        uri: ibiboApi
      }, async function (error, response, body) {
        console.log('res codesss',response.statusCode)
        if (!error && response.statusCode == 200) {
          body = JSON.parse(body);
         
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
          if(recC < 10)
           { check(element,src,des);  }
          else{
            recC = 0;
          } 
        }
      })
}