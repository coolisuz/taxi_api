const mongoose = require("mongoose");

before(done => {
  mongoose.connect("mongodb://localhost/taxi_test");
  mongoose.connection
    .once("open", () => done())
    .on("error", err => {
      console.warn("Warning", error);
    });
});

beforeEach(done => {
  const { drivers } = mongoose.connection.collections;
  drivers
    .drop()
    //everysingle time after I drop the table, it goes and re-creates
    //the geometry coordinates in drivers collection
    .then(() => drivers.ensureIndex({ "geometry.coordinates": "2dsphere" }))
    .then(() => done())
    .catch(() => done());
});
