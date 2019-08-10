let functions = {
    //retourne un nombre entier entre min et max
    getRndInteger: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    },

    //foreach async
    forEach: function(list, callback) {
        //debug(list);
        return new Promise( async (resolve, reject) => {
            if(_.isArray(list)) {
                await Promise.all(
                    list.map( (elem, i, list) => callback(elem, i, list))
                )
            } else if(_.isObject(list)) {
                await Promise.all(
                    _.map( list, (elem, i, list) => callback(elem, i, list))
                )
            } else {
                reject(false);
            }
            resolve(true);
        });
        
    },

    //trim function
    trim: (x) => {
        return x.replace(/^\s+|\s+$/gm,'');
    }

}

module.exports = functions;