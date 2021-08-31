const express = require('express');
const router = express.Router();

const MarriottDerbyHotels = require('../seeds/hotels/MarriotDerbyList');
/* GET home page. */

const marriottCodeList = [];

MarriottDerbyHotels.map(hotel => {
  if (hotel.hotelId) {
    marriottCodeList.push(hotel.hotelId)
  } else {
    console.log('nope')
  }
});


router.get('/', (req, res, next) => {

  console.log('TOTAL CODE LIST : ', marriottCodeList.length);
  res.status(200).json(marriottCodeList);
});

module.exports = router;
