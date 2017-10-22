'use strict';

const mongoose  = require('mongoose');

let Schema  = mongoose.Schema;

let ProductSchema = new Schema({
    product_id: Number,
    // variation_id: Number,
    product_name: String,
    location: String,
    shop: String,
    category: String,
    variations: [{ type: Schema.Types.ObjectId, ref: 'Variation' }],

    // variations: [{
    //     variation_id: String,
    //     description: String,
    //     image: String,
    //     price: Number,
    // 	size: String,
    // 	noodle: String,
    // 	sauce: String,

    //     numsales: Number
    // }],
    // manufacturer: String,
    // price: Number,
    image: String
});
// },{collection: 'products'});

module.exports = mongoose.model('Product', ProductSchema);