const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');


app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(require("./middlewares/auth"));

const controllers_files = fs.readdirSync('./controllers');
controllers_files.forEach((controller) => {
  app.use(require("./controllers/" + controller));
});

app.listen(8060);

