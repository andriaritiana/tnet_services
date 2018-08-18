const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
//To activate : in console (DEBUG=app:startup npm run start)
//To desactivate : in console (DEBUG= npm run start)
const debug = require('debug')('app:startup');


app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(require("./middlewares/auth"));

const controllers_files = fs.readdirSync('./controllers');
controllers_files.forEach((controller) => {
  app.use(require("./controllers/" + controller));
});

console.log(`NODE ENV ${process.env.NODE_ENV}`);
console.log(`APP ENV  ${app.get("env")}`);

const port = process.env.port || 8060;
app.listen(port, () => debug(` Listening on port ${port} ...`));

