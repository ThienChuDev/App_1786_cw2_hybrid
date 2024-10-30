const homeRouter = require("./homeRouter");
const crudRouter = require("./crudRouter");

function router(app) {
  app.use("/crud", crudRouter);
  app.use("/", homeRouter);
}

module.exports = router;
