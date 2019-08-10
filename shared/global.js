global.debug = global.debug = process.env.NODE_ENV == 'test' ? require('debug')('app:test') : require('debug')('app:startup');
global.message = require("./messages_fr");
global.utilities = require("./utilities");
global.error = require("./errors");
global._ = require('underscore');