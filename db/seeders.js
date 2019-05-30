const baseModel = require("../models/seeding_model");

// Setting global variables
global.debug = require('debug')('app:population');
global.message = require("../shared/messages_fr");
global.utilities = require("../shared/utilities");
global.error = require("../shared/errors");
global._ = require('underscore');

// Populate function
const populateDb = () => {
  debug("Initializing database configuration")
  return new Promise(async (resolve, reject) => {
    try {
      const base = new baseModel("default");
      if(process.env.NODE_ENV == "test") {
        await base.purgeDatabase()
        debug('Fin du purge des databases')
      }
      debug('Start populate >>> ')
      const result = await base.lancer_alimentation_auto();
      debug(result);
      resolve("Database(s) créée(s)");
    } catch (e) {
      debug(e);
      reject("Erreur de traitement survenue");
    }
  })
}

const purgeDb = () => {
  debug("Initializing database configuration")
  return new Promise(async (resolve, reject) => {
    try {
      const base = new baseModel("default");
      await base.purgeDatabase();
      resolve("Database(s) purged!");
    } catch (e) {
      debug(e);
      reject("Erreur de traitement survenue");
    }
  })
}

debug('Initializing app population');
( process.env.NODE_ENV == "purge" ? purgeDb() : populateDb()).
then( (res) => {
  debug("Population successful")
  debug(res)
}).
catch( (err) => {
  debug("Population encountered an error")
  debug(err)
}).
finally( () => {
  debug("Finishing bulk population")
})



