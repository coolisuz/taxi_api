const DriversController = require("../controllers/drivers_controllers");
module.exports = app => {
  //Watch for incoming request of method GET
  //to the route http://localhost:3050/api

  app.post("/api/drivers", DriversController.create);
  app.put("/api/drivers/:id", DriversController.edit);
  app.delete("/api/drivers/:id", DriversController.delete);
  app.get("/api/drivers", DriversController.index);
};
