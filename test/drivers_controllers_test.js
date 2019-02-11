const assert = require("assert");
const request = require("supertest");
const mongoose = require("mongoose");
const Driver = mongoose.model("driver");
const app = require("../app");

describe("Drivers Controllers", () => {
  it("Post to /api/drivers creates a new driver", done => {
    Driver.count().then(count => {
      request(app)
        .post("/api/drivers")
        .send({ email: "test@gmail.com" })
        .end(() => {
          Driver.count().then(newCount => {
            assert(count + 1 === newCount);
            done();
          });
        });
    });
  });

  it("PUT to /api/driver/id edits an existing driver", done => {
    const driver = new Driver({ email: "aaa@gmail.com", driving: false });
    driver.save().then(() => {
      request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({ driving: true })
        .end(() => {
          Driver.findOne({ email: "aaa@gmail.com" }).then(driver => {
            assert(driver.driving === true);
            done();
          });
        });
    });
  });

  it("DELETE to /api/driver/id can delete a driver", done => {
    const driver = new Driver({ email: "bbb@gmail.com" });

    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end(() => {
          Driver.findOne({ email: "bbb@gmail.com" }).then(driver => {
            assert(driver === null);
            done();
          });
        });
    });
  });

  it("GET to /api/drivers fins drivers in a location", done => {
    const seattleDriver = new Driver({
      email: "seattle@gmail.com",
      geometry: { type: "Point", coordinates: [-122.4759902, 47.6147628] }
    });

    const miamiDriver = new Driver({
      email: "miami@gmail.com",
      geometry: { type: "Point", coordinates: [-80.253, 25.791] }
    });

    Promise.all([seattleDriver.save(), miamiDriver.save()]).then(() => {
      request(app)
        .get("/api/drivers?lng=-80&lat=25")
        .end((err, response) => {
          console.log(response.status);
          done();
        });
    });
  });
});
