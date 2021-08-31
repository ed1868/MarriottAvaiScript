const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const axios = require('axios');
const MarriottHotelCodeList = require('./seeds/hotels/MarriottHotelCodeList');
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

const index = require('./routes/index');
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
queryHotel = (id, checkin, checkout) => {
  console.log(`HOTEL ${id} IS BEING QUERIED`);
  console.log(`HOTEL CHECK IN : ${checkin} `);
  console.log(`HOTEL CHECK OUT : ${checkout} `);


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
          succesfulQueries.push({
            hotelId: payload.data.hotelId, roomRates: payload.data.roomRates
          })


        } else {
          console.log(payload.data)
        }

      }
      console.log('succesful hotel queries ::::: ', succesfulQueries.length);
    })
    .catch((err) => {
      unsuccesfulQueries.push(id);
      if (err && err.code == "ETIMEDOUT") {
        console.log(':::::::::::::UNDEFINED ERROR :::::::::::::: ', err)
        setTimeout(function () {
          console.log(':::::::::::::::ERROR FIX SET TIME OUT ID :::::::::::::::::::::::::::::::', id)
          queryHotel(id, checkin, checkout)
        }, 6000)

      }
      if (err && err.response.status) {
        if (err.response.status == "429") {
          setTimeout(function () {
            console.log(':::::::::::::::ERROR FIX SET TIME OUT ID :::::::::::::::::::::::::::::::', id)
            queryHotel(id, checkin, checkout)
          }, 6000)
        }
      }
      else {
        console.log('THE FUCKING BIG ERROR: ', err)
      }


      console.log('unsuccesful hotel queries :::::: ', unsuccesfulQueries)
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

getAllHotels()


module.exports = app;
