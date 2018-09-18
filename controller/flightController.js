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
  cronTime: "00 06 14 * * 0-6",
  onTick: async function () {
    // let date = moment().format('YYYYMMDD')
  for(let i=0; i<30;i++){
      setTimeout(()=>{
        let date = moment().add(i,'days').format('YYYYMMDD')
        crawl(date);
        console.log('dateee', date);
        
      },20000*(i+1));
    }
  },
  start: false,
  timeZone: "Asia/Kolkata"
});
notifier.start();


async function crawl(date) {
  console.log("heloo cron activated", date);
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
    // {
    //   sourceCode: 'DEL',
    //   destinationCode: 'IXC',
    //   sourceName: 'New Delhi',
    //   destinationName: 'Chandigarh'
    // },
    // {
    //   sourceCode: 'DEL',
    //   destinationCode: 'MAA',
    //   sourceName: 'New Delhi',
    //   destinationName: 'Chennai'
    // },

    // // 1st set
    // {
    //   sourceCode: 'BOM',
    //   destinationCode: 'DEL',
    //   sourceName: 'Mumbai',
    //   destinationName: 'New Delhi'
    // },
    // {
    //   sourceCode: 'BOM',
    //   destinationCode: 'BLR',
    //   sourceName: 'Mumbai',
    //   destinationName: 'Bengaluru'
    // },
    // {
    //   sourceCode: 'BOM',
    //   destinationCode: 'HYD',
    //   sourceName: 'Mumbai',
    //   destinationName: 'Hyderabad'
    // },
    // {
    //   sourceCode: 'BOM',
    //   destinationCode: 'IXC',
    //   sourceName: 'Mumbai',
    //   destinationName: 'Chandigarh'
    // },
    // {
    //   sourceCode: 'BOM',
    //   destinationCode: 'MAA',
    //   sourceName: 'Mumbai',
    //   destinationName: 'Chennai'
    // },
    // // 2nd set 
    // {
    //   sourceCode: 'BLR',
    //   destinationCode: 'DEL',
    //   sourceName: 'Bengaluru',
    //   destinationName: 'Delhi'
    // },
    // {
    //   sourceCode: 'BLR',
    //   destinationCode: 'BOM',
    //   sourceName: 'Bengaluru',
    //   destinationName: 'Mumbai'
    // },
    // {
    //   sourceCode: 'BLR',
    //   destinationCode: 'HYD',
    //   sourceName: 'Bengaluru',
    //   destinationName: 'Hyderabad'
    // },
    // {
    //   sourceCode: 'BLR',
    //   destinationCode: 'IXC',
    //   sourceName: 'Bengaluru',
    //   destinationName: 'Chandigarh'
    // },
    // {
    //   sourceCode: 'BLR',
    //   destinationCode: 'MAA',
    //   sourceName: 'Bengaluru',
    //   destinationName: 'Chennai'
    // },
    // // 3rd set 
    // {
    //   sourceCode: 'HYD',
    //   destinationCode: 'DEL',
    //   sourceName: 'Hyderabad',
    //   destinationName: 'Delhi'
    // },
    // {
    //   sourceCode: 'HYD',
    //   destinationCode: 'BOM',
    //   sourceName: 'Hyderabad',
    //   destinationName: 'Mumbai'
    // },
    // {
    //   sourceCode: 'HYD',
    //   destinationCode: 'BLR',
    //   sourceName: 'Hyderabad',
    //   destinationName: 'Bengaluru'
    // },
    // {
    //   sourceCode: 'HYD',
    //   destinationCode: 'IXC',
    //   sourceName: 'Hyderabad',
    //   destinationName: 'Chandigarh'
    // },
    // {
    //   sourceCode: 'HYD',
    //   destinationCode: 'MAA',
    //   sourceName: 'Hyderabad',
    //   destinationName: 'Chennai'
    // },

    // // // 4th set
    // {
    //   sourceCode: 'IXC',
    //   destinationCode: 'DEL',
    //   sourceName: 'Chandigarh',
    //   destinationName: 'Delhi'
    // },
    // {
    //   sourceCode: 'IXC',
    //   destinationCode: 'BOM',
    //   sourceName: 'Chandigarh',
    //   destinationName: 'Mumbai'
    // },
    // {
    //   sourceCode: 'IXC',
    //   destinationCode: 'BLR',
    //   sourceName: 'Chandigarh',
    //   destinationName: 'Bengaluru'
    // },
    // {
    //   sourceCode: 'IXC',
    //   destinationCode: 'HYD',
    //   sourceName: 'Chandigarh',
    //   destinationName: 'Hyderabad'
    // },
    // {
    //   sourceCode: 'IXC',
    //   destinationCode: 'MAA',
    //   sourceName: 'Chandigarh',
    //   destinationName: 'Chennai'
    // },

    // // 5th set 
    // {
    //   sourceCode: 'MAA',
    //   destinationCode: 'DEL',
    //   sourceName: 'Chennai',
    //   destinationName: 'New Delhi'
    // },
    // {
    //   sourceCode: 'MAA',
    //   destinationCode: 'BOM',
    //   sourceName: 'Chennai',
    //   destinationName: 'Mumbai'
    // },
    // {
    //   sourceCode: 'MAA',
    //   destinationCode: 'BLR',
    //   sourceName: 'Chennai',
    //   destinationName: 'Bengaluru'
    // },
    // {
    //   sourceCode: 'MAA',
    //   destinationCode: 'HYD',
    //   sourceName: 'Chennai',
    //   destinationName: 'Hyderabad'
    // },
    // {
    //   sourceCode: 'MAA',
    //   destinationCode: 'IXC',
    //   sourceName: 'Chennai',
    //   destinationName: 'Chandigarh'
    // }

  ]

  for (let i = 0; i < pairOfOriginDestination.length; i++) {

    let element = pairOfOriginDestination[i];

    check(element, element.sourceCode, element.destinationCode, date)
      .then(data => {
        // console.log(data);
      });
  }
}

async function check(element, src, des, date) {
  
  var status = 502;
  let ibiboApi = `http://developer.goibibo.com/api/search/?app_id=f07bdf95&app_key=` + process.env.IBIBO_API_KEY + `&format=json&source=` + src + `&destination=` + des + `&dateofdeparture=` + date + `&seatingclass=E&adults=1&children=0&infants=0&counter=100`
  await request({
    method: 'GET',
    uri: ibiboApi,
  }, async function (error, response, body) {
    console.log('res codesss',response.statusCode)
    try {
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
            depDate: el.depdate,
            depTime: el.deptime,
            travelDuration: el.duration
          }
          detailArr.push(ob);
        })
        let dateSet = (new Date()).setDate((date).slice(6));
        let monthSet = new Date(dateSet).setMonth((date).slice(4,6)-1);
        let setYear = new Date(monthSet).setYear((date).slice(0,4));

        let clubbed = {
          source: element.sourceName,
          destination: element.destinationName,
          sourceCode: element.sourceCode,
          created_on: Date.now(),
          destinationCode: element.destinationCode,
          dateOfDeparture: new Date(setYear),
          slug: element.sourceCode.toLowerCase() + '-' + element.destinationCode.toLowerCase(),
          flightDetails: detailArr
        }
        let obj = await new flight(clubbed);

        let ans = await obj.save();
        if (!ans) {
          return response.statusCode;
        } else {
          console.log("data saved");
          return response.statusCode;
        }

      }
      else {
        recC++;
        if (status != 200) { check(element, src, des, date); }
        else {
          status = 502
        }
      }
    } catch (err) {
      sendMail(err);
    }
  })
}


function sendMail(err) {
  console.log("come here to send mail");
  let i = 10;
  let msg = {
    to: ['harsh.singh@venturepact.com',
      'shubham.latiyan@venturepact.com'],
    from: 'flightCrawler@error.com',
    subject: 'Some Exception occured!',
    text: err.toString()
  }
  sgMail.send(msg).then(() => {
    console.log("kaam ho gya");

  })
}

exports.getFlightDetails = async (req, res) => {
  console.log('bodyyyyyyyyyy', req.body);

  let fromDate = req.body.originDate;
  let toDate = req.body.toDate;

  let origin = req.body.origin;
  let destination = req.body.destination;
  origin = origin.toLowerCase();
  destination = destination.toLowerCase();
  fromDate = new Date(fromDate);
  console.log(fromDate);

  if (toDate == '' || toDate == null) {
    toDate = fromDate
  } else {
    toDate = new Date(toDate)
  }
  console.log("todate", toDate);

  toDate=toDate.setHours(23, 59, 59, 999);

  fromDate=fromDate.setHours(0, 0, 0, 0);
 fromDate = new Date(fromDate)
 toDate = new  Date(toDate)
  console.log(toDate, fromDate);

  let slug = origin + '-' + destination;

  slug = slug.toString();
  console.log("slug", slug);
  try {
    let fetchedData;

    fetchedData = await flight.aggregate([{
      $match: {
        $and: [{ slug: slug },
          {
            dateOfDeparture: {
              $gte: fromDate
            }
          },
          {
            dateOfDeparture: {
              $lte: toDate
            }
          }]
      }
    },
    {
      $unwind: '$flightDetails'
    },
    {
      $sort: {
        dateOfDeparture: 1
      }
    }])
    console.log("console kar lo", fetchedData.length);

    if (fetchedData) {
      res.json({
        success: true,
        data: fetchedData
      })
    }
  } catch (error) {
    console.log("error", error);
    sendMail(error.toString())
    res.json({
      success: false,
      msg: "Some esception occured!"
    })
  }
}