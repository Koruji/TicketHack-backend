const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    price: Number,
    //a ajouter un timer pour le temps restant
});

const Purchase = mongoose.model('purchases', tripSchema);

module.exports = Purchase;