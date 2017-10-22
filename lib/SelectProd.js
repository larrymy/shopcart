var _ = require("underscore");

class SelectProd {
    static uniqueLocation(obj) {
        if(!obj) {
            return;
        }else{
        	return _.chain(obj).pluck('location').uniq().value();
        }
    }

  	static uniqueShop(obj) {
        if(!obj) {
            return;
        }else{
        	return _.chain(obj).pluck('shop').uniq().value();
        }
    }

    static uniqueCategory(obj) {
        if(!obj) {
            return;
        }else{
        	return _.chain(obj).pluck('category').uniq().value();
        }
    }
}

module.exports = SelectProd;