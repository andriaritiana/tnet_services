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
                for(let i = 0; i < list.length; i++) {
                    await callback(list[i], i, list);
                }
            } else if(_.isObject(list)) {
                for(let key in list) {
                    await callback(list[key], key, list);
                }
            } else {
                reject(false);
            }
            resolve(true);
        });
        
    },

}

module.exports = functions;