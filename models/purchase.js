const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    price: Number,
});

const Purchase = mongoose.model('purchase', tripSchema);

module.exports = Purchase;