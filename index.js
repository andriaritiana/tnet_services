let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let fs = require('fs');
const https = require('https');

var options = {
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.crt'),
  //ca: fs.readFileSync('certificates/ca_bundle.crt')
};


app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(require("./middlewares/auth"));
app.use(require("./controllers/cooperative_controller"));
app.use(require("./controllers/guichet_controller"));

app.listen(8060);
https.createServer(options, app).listen(443);

