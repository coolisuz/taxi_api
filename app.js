const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");

mongoose.Promise = global.Promise;

//preventing mocha to save data to database. Checkout package.json
if (process.env.NODE_ENV !== "test") {
  mongoose.connect("mongodb://localhost/taxi");
}

//Any incoming request, just assume its json and parse it to an object for us.
//EXTREMELY IMPORTANT TO DECLARE BEFORE routes
app.use(bodyParser.json());
routes(app);

//err     --> gets populated if the previous middleware threw an error
//next    --> is a function executes the next middleware. To execute the next middleware
//we have to manually call the next() function.
app.use((err, req, res, next) => {
  res.status(422).send({ error: err._message });
});

module.exports = app;
