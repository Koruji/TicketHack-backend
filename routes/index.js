const Trips = require("../models/trips");
var express = require('express');
var router = express.Router();


router.get("/trips", async(req, res) => {
  try {

    const data = await Trips.find();
    res.status(201).json({result: true, trips: data});

  } catch(error) {
    res.status(404).json({result: false, message: "Trips not found"});
  }
  
});


module.exports = router;
