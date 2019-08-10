const baseModel = require("../models/seeding_model");

// Setting global variables
global.debug = process.env.DEBUG == 'app:purge' ? require('debug')('app:purge') : require('debug')('app:population');
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

if(process.env.DEBUG == "app:purge" ) {
  debug('>>>>>>>>>>>>>>>>>>>>> ------------------- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
  debug('Initializing purge of databases')
  purgeDb().then(() => {
    debug('Success purging databases!!!')
  }).catch((err) => {
    debug('there was an error when purging dabases')
  }).finally(() => {
    debug('Purge process finished')
    debug('>>>>>>>>>>>>>>>>>>>>> ------------------- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
    process.exit(0)
  })
} else {
  debug('>>>>>>>>>>>>>>>>>>>>> ------------------- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')  
  debug('Initializing app population');
  populateDb().
  then( (res) => {
    debug("Population successful")
    debug(res)
  }).
  catch( (err) => {
    debug("Population encountered an error")
    debug(err)
  }).
  finally( () => {
    debug("Bulk population process finished")
    debug('>>>>>>>>>>>>>>>>>>>>> ------------------- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
    process.exit(0)
  })
}




