const Driver = require("../models/driver");
module.exports = {
  index(req, res, next) {
    const { lng, lat } = req.query;
    //'http://google.com?lng=80&lat=20'

    Driver.geoNear(
      { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
      { spherical: true, maxDistance: 200000 }
    )
      .then(drivers => {
        console.log("*******************" + drivers);
        res.send(drivers);
      })
      .catch(next);
  },

  //next here says: if smth is wrong with request to get saved to db
  //go to catch and it will go the next error handling middleware. In my case app.js line:22
  create(req, res, next) {
    const driverProps = req.body;
    //creating and saving the user and then sending back
    //driver object back to whoever made the request
    Driver.create(driverProps)
      .then(driver => {
        res.send(driver);
      })
      .catch(next);
  },

  edit(req, res, next) {
    //to get the id of the driver using req.params.id

    const driverId = req.params.id;
    const driverProps = req.body;

    //inherently findByIdAndUpdate does not provide driver argument
    //the promise thats why im calling another request to find the driver
    //and send it back where request came from
    Driver.findByIdAndUpdate({ _id: driverId }, driverProps)

      .then(() => Driver.findById({ _id: driverId }))
      .then(driver => res.send(driver))
      .catch(next);
  },

  delete(req, res, next) {
    const driverId = req.params.id;

    Driver.findByIdAndDelete({ _id: driverId })
      .then(driver => res.status(204).send(driver))
      .catch(next);
  }
};
