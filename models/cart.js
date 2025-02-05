const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    price: Number,
});

const Cart = mongoose.model('carts', tripSchema);

module.exports = Cart;