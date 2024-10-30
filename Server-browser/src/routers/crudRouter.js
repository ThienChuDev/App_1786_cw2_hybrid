const express = require("express");
const router = express.Router();
const CrudController = require("../controllers/CrudContronller");

router.post("/createClass", CrudController.createClass);

module.exports = router;
