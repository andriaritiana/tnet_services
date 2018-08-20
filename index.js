const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
//To activate : in console (DEBUG=app:startup npm run start)
//To desactivate : in console (DEBUG= npm run start)
global.debug = require('debug')('app:startup');
const controllers_files = fs.readdirSync('./controllers');
controllers_files.forEach((controller) => {
  app.use(require("./controllers/" + controller));
});

const port = process.env.port || 8060;
app.listen(port, () => debug(` Listening on port ${port} ...`));

