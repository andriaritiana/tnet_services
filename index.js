const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
//To activate : in console (DEBUG=app:startup npm run start)
//To desactivate : in console (DEBUG= npm run start)
global.debug = require('debug')('app:startup');
global.message = require("./shared/messages_fr");
global.cooperative_name = "cotisse";
global.utilities = require("./shared/utilities");
global.error = require("./shared/errors");
global._ = require('underscore');

debug(utilities);
debug(utilities.getRndInteger(15, 59));
app.set('view engine', 'ejs');
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200/*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(require("./middlewares/auth"));

const controllers_files = fs.readdirSync('./controllers');
debug(controllers_files);
controllers_files.forEach((controller) => {
  app.use(require("./controllers/" + controller));
});


console.log(`NODE ENV ${process.env.NODE_ENV}`);
console.log(`APP ENV  ${app.get("env")}`);

const port = process.env.port || 8060;
app.listen(port, () => debug(` Listening on port ${port} ...`));

