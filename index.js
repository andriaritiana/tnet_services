let express = require('express');
let app = express();
let bodyParser = require('body-parser');


app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  console.log("Bonjour api");
});

app.listen(8060);

