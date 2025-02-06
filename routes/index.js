const Trips = require("../models/trips");
const Cart = require("../models/cart");
const Purchase = require("../models/purchase");
const moment = require("moment");


var express = require('express');
var router = express.Router();

//GET /trips 
//Résulat attendu : 
// result : true,
// trips : [{
//      arrival: "Lyon"
//      date: "2025-02-06T00:01:21.013Z"
//      departure: "Marseille"
//      price: 60
//      _id: "67a3700b6c009280a252cc37"
//  }]
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

//POST /book/:id 
//Résulat attendu : 
// result: true,
// message: "Trip saved !"
//tranfert un voyage de la collection trips vers la collection carts
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

//GET /cart 
//Résulat attendu : 
// result : true,
// trips : [{
//      arrival: "Lyon"
//      date: "2025-02-06T00:01:21.013Z"
//      departure: "Marseille"
//      price: 60
//      _id: "67a3700b6c009280a252cc37"
//  }]
router.get("/cart", async (req, res) => {
  try {
    
    const data = await Cart.find();
    
    if(data.length === 0) {
      res.status(404).json({result: false, message: "Trips not found"});
    } else {
      res.status(201).json({result: true, trips: data});
    }

  } catch(error) {
    res.status(500).json({result: false, message: "Server error"});
  }
});

//GET /purchase 
//Résulat attendu : 
// result : true,
// purchases : [{
//      arrival: "Lyon"
//      date: "2025-02-06T00:01:21.013Z"
//      departure: "Marseille"
//      price: 60
//      _id: "67a3700b6c009280a252cc37"
//  }]
router.get("/purchase", async (req, res) => {
  try {
    const data = await Purchase.find();
    
    if(data.length === 0) {
      res.status(404).json({result: false, message: "Trips not found"});
    } else {
      res.status(201).json({result: true, trips: data});
    }
    
  } catch (error) {
    res.status(404).json({ result: false, message: "Purchases not found" });
  }
});

//POST /purchase 
//Résulat attendu : 
// result : true,
// message: "Purchase completed!",
// purchase : [{
//      arrival: "Lyon"
//      date: "2025-02-06T00:01:21.013Z"
//      departure: "Marseille"
//      price: 60
//      _id: "67a3700b6c009280a252cc37"
//  }]
router.post("/purchase", async (req, res) => {
  try {
    const data = await Cart.find();

    console.log(data);

    if (data.length !== 0) {
      for(const purchaseData of data) {
        const newPurchase = new Purchase({
          departure: purchaseData.departure,
          arrival: purchaseData.arrival,
          date: purchaseData.date,
          price: purchaseData.price,
        });
  
        await newPurchase.save();
  
        await Cart.deleteOne({ _id: purchaseData._id });
      }
      res
        .status(201)
        .json({ result: true, message: "Purchase completed!", purchase: data });
    } else {
      res
        .status(404)
        .json({ result: false, message: "Cart item not found!", data: purchaseData });
    }
  } catch (error) {
    res.status(500).json({ result: false, message: error.message });
  }
});


module.exports = router;
