'use strict';

const mongoose  = require('mongoose');

var Schema  = mongoose.Schema;

let VariationSchema = new Schema({
        variation_id: String,
        description: String,
        image: String,
        price: Number,
    	size: String,
    	noodle: String,
    	sauce: String,

        numsales: Number
});
// },{collection: 'products'});

module.exports = mongoose.model('Variation', VariationSchema);