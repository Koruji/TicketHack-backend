const Trips = require("../models/trips");
const Cart = require("../models/cart");
const Purchase = require("../models/purchase");
const moment = require("moment");


var express = require('express');
var router = express.Router();


router.get("/trips", async(req, res) => {
  try {

    const startDate = moment(req.query.date, "YYYY-MM-DD").startOf("day").toDate();
    const endDate = moment(req.query.date, "YYYY-MM-DD").endOf("day").toDate();

    const data = await Trips.find({
      departure: req.query.departure, 
      arrival: req.query.arrival, 
      date: { $gte: startDate, $lt: endDate }
    });

    if(data.length === 0) {
      res.status(404).json({result: false, message: "Trips not found"});
    } else {
      res.status(201).json({result: true, trips: data});
    }
    

  } catch(error) {
    res.status(500).json({result: false, message: "Server error"});
  }
});

router.post("/book/:id", async(req, res) => {
  try {

    const data = await Trips.findById(req.params.id);

    console.log(data);

    if(data) {
      
      const newCartTrip = new Cart({
        departure: data.departure,
        arrival: data.arrival,
        date: data.date,
        price: data.price,
      });

      const saveTrip = await newCartTrip.save();

      await Trips.deleteOne({_id: data._id});

      res.status(201).json({result: true, message: "Trip saved !"});

    } else {
      res.status(404).json({result: false, message: "Trip not found !", data : data});
    }

  } catch(error) {
    res.status(500).json({result: false, message: error });
  }
});

router.get("/cart", async (req, res) => {
  try {
    
    const data = await Cart.find();
    res.status(201).json({result: true, trips: data});

  } catch(error) {
    res.status(404).json({result: false, message: "Trips not found"});
  }
});


module.exports = router;
