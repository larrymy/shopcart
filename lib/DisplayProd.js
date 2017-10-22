var _ = require("underscore");

class DisplayProd {
    static numUnique(obj) {
        if(!obj) {
            return 0;
        }else{
        	return _.chain(obj).pluck('product_id').uniq().size().value();
        }
    }
    
    static variationList(obj, product_id) {
        if(!obj) {
            return;
        }else{
            var variation_arr = _.chain(obj)
                    .where({product_id: product_id})
                    .pluck("variations")
                    .values()
                    .keys()
                    // .value();
            
            return variation_arr;           
        }
    }

    static variationKeys(obj, product_id) {
        if(!obj) {
            return;
        }else{
            var variation_key = _.chain(obj)
                    .findwhere({product_id: product_id})
                    .pluck("variations")
                    .keys()
                    .value();
            
            return variation_key;           
        }
    }

    static getVariationId(obj, product_id, variation_obj) {
        if(!obj) {
            return;
        }else{
            var variation_id = _.chain(obj)
                    .findwhere({product_id: product_id, variations: variation_obj})
                    .pluck("variation_id")
                    .value()
            return variation_id;           
        }
    }

}

module.exports = DisplayProd;