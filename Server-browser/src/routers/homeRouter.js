const express = require("express");
const router = express.Router();
const HomeController = require("../controllers/HomeController");

router.delete("/booking/:id", HomeController.deleteBooking);
router.get("/booking/:id", HomeController.getBookings);
router.post("/booking", HomeController.createdBooking);
router.get("/logout", HomeController.logout);
router.post("/login", HomeController.login);
router.post("/register", HomeController.register);
router.get("/", HomeController.index);

module.exports = router;
