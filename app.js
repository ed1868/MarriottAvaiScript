const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const axios = require('axios');
// const MarriottHotelCodeList = require('./seeds/hotels/MarriottHotelCodeList');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const MarriottHotelCodeList = [
  "ABQFI",
  "ABERI",
]

console.log(MarriottHotelCodeList);
const index = require('./routes/index');
// const MarriotHotelCodeList = require('./seeds/hotels/MarriottHotelCodeList');
app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const testArr = [
  "ABYFX",
  "ABVSI"
]

const succesfulQueries = [

]

const unsuccesfulQueries = [

]

const noRateQueries = [

]


const marriottToActivate = [

]

queryHotel = (id, checkin, checkout) => {
  // console.log(`HOTEL ${id} IS BEING QUERIED`);
  // console.log(`HOTEL CHECK IN : ${checkin} `);
  // console.log(`HOTEL CHECK OUT : ${checkout} `);

  // console.log('CODE LIST :::: ',MarriottHotelCodeList.length)
  axios({
    method: "post",
    url: "https://go3-tn4-aws.derbysoftca.com/api/go/bookingusb/v4/availability",
    headers: {
      Authorization:
        "2Rrae9SU2G50R3ZmGJ0000011dfc52488ecb444a8b4a1eda945f0f4c",
    },
    data: {
      "header": {
        "supplierId": "MARRIOTT",
        "distributorId": "OVERSEAS",
        "version": "v4.0",
        "token": "1630430035483"
      },
      "stayRange": {
        "checkin": checkin,
        "checkout": checkout
      },
      "roomCriteria": {
        "roomCount": 1,
        "adultCount": 1,
        "childCount": 0,
        "childAges": []
      },
      "hotelId": id,
      "iata": "",
      "promoteCode": "",
      "isAfterPromotion": false
    }
  })
    .then((payload) => {
      if (payload.status == "200") {
        if (payload.data.roomRates.length >= 1) {
          succesfulQueries.push(
            payload.data.hotelId
          )


        } else {
          console.log(payload.data)
          noRateQueries.push({ hotelId: id, stayRange: payload.data.stayRange })
        }

      }
      console.log('succesful hotel queries ::::: ', succesfulQueries.length);
      console.log('succesful hotel queries WITH NO RATES ::::: ', noRateQueries.length);
    })
    .catch((err) => {


      // if (err && err.code == "ENOTFOUND") {
      //   // console.log(':::::::::::::UNDEFINED ERROR :::::::::::::: ', err)
      //   marriottToActivate.push(id);

      // }

      if (err && err.response) {
        // console.log('ERROR RESPONSE::::::', err.response)
        if (err.response.status == 500) {

          if (err.data) {
            console.log(err)
            console.log("TIMEOUT OR INTERNAL SERVER ERROR :: ", id);
            setTimeout(function () {
              console.log("ENTERING SET TIMEOUT FOR HOTEL : ", id);
              // console.log(':::::::::::::::ERROR FIX SET TIME OUT ID :::::::::::::::::::::::::::::::', id)
              queryHotel(id, checkin, checkout)
            }, 5000)
          }

        } else {
          console.log('OTHER ERROR ::::::::::>>>>>>>>>>> ', err)
        }
        //   if (err.response.status == 500) {
        //     console.log('nope')
        //     // setTimeout(function () {
        //     //   console.log('set time out : ', id)
        //     //   // console.log(':::::::::::::::ERROR FIX SET TIME OUT ID :::::::::::::::::::::::::::::::', id)
        //     //   queryHotel(id, checkin, checkout)
        //     // }, 5000)
        //   }
        // }else{
        //   console.log('NEW ERROR: ',err);
        //   unsuccesfulQueries.push(id);
        // }

        // setTimeout(function () {
        //   console.log(':::::::::::::::ERROR FIX SET TIME OUT ID :::::::::::::::::::::::::::::::', id)
        //   queryHotel(id, checkin, checkout)
        // }, 10000)
        // console.log('ERRRORRRR :::::: ', err)
        // unsuccesfulQueries.push(id);



        // }
        // if (err && err.response.status) {
        //   if (err.response.status == "429") {
        //     setTimeout(function () {
        //       console.log(':::::::::::::::ERROR FIX SET TIME OUT ID :::::::::::::::::::::::::::::::', id)
        //       queryHotel(id, checkin, checkout)
        //     }, 10000)
        //   }
        // }
        // else {
        //   console.log('THE FUCKING BIG ERROR: ', err)
        // }
      } else {
        console.log('OTHER ERROR ::::::::::>>>>>>>>>>> ', err)
      }

      console.log('unsuccesful hotel queries :::::: ', unsuccesfulQueries.length)
    });
}


async function getQuery(hotelId) {
  let checkin = "2021-09-10";
  let checkout = "2021-09-12";

  await queryHotel(hotelId, checkin, checkout)


}



async function getAllHotels() {
  const apiPromises = MarriottHotelCodeList.map(getQuery)

  await Promise.all(apiPromises)
}

// getAllHotels()

let counter = 0;
let arr = ["a","b","c","d"];
drStrange = (str) => {
  counter += 1;

  console.log(str, '::::THE CURRENT LOOP IN TIME OUT IS ::: ', counter);
  return;


}

setTimeout(function() {
  arr.forEach(item => {
    drStrange(item);
  })
},10000)



module.exports = app;
